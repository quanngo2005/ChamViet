package com.vn.chamviet.chamviet_api.product.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vn.chamviet.chamviet_api.entity.OrderDetail;
import com.vn.chamviet.chamviet_api.entity.OrderLog;
import com.vn.chamviet.chamviet_api.entity.Orders;
import com.vn.chamviet.chamviet_api.entity.Voucher;
import com.vn.chamviet.chamviet_api.entity.repository.OrdersRepo;
import com.vn.chamviet.chamviet_api.entity.repository.VoucherRepo;
import com.vn.chamviet.chamviet_api.product.ProductVariant;
import com.vn.chamviet.chamviet_api.product.ProductVariantComponent;
import com.vn.chamviet.chamviet_api.user.Account;
import com.vn.chamviet.chamviet_api.user.AccountRepo;
import jakarta.persistence.EntityNotFoundException;
import lombok.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BoxOrderService {
    private final OrdersRepo ordersRepo;
    private final VoucherRepo voucherRepo;
    private final AccountRepo accountRepo;
    private final ProductService productService;
    private final ComponentInventoryService componentInventoryService;
    private final ProductVariantCompositionService compositionService;
    private final ObjectMapper objectMapper;

    @Transactional
    public Orders createOrder(CreateBoxOrderCommand command) {
        if (command.quantity() <= 0) {
            throw new IllegalArgumentException("Order quantity must be greater than 0");
        }

        Account account = accountRepo.findById(command.accountId())
            .orElseThrow(() -> new EntityNotFoundException("Account not found: " + command.accountId()));
        ProductVariant variant = productService.getDetailedVariant(command.productVariantId());
        compositionService.validateBoxVariant(variant);

        Voucher voucher = command.voucherId() == null ? null : voucherRepo.findById(command.voucherId())
            .orElseThrow(() -> new EntityNotFoundException("Voucher not found: " + command.voucherId()));

        BigDecimal totalPrice = variant.getPrice().multiply(BigDecimal.valueOf(command.quantity()));
        BigDecimal finalPrice = applyVoucher(totalPrice, voucher);

        OrderDetail orderDetail = OrderDetail.builder()
            .productVariant(variant)
            .quantity(command.quantity())
            .snapshotPrice(variant.getPrice())
            .snapshotProductName(variant.getProduct().getName())
            .snapshotVariantSku(variant.getSku())
            .snapshotComponentsJson(toSnapshotJson(variant.getComponents()))
            .build();

        Orders order = Orders.builder()
            .account(account)
            .voucher(voucher)
            .status(Orders.OrderStatus.RESERVED)
            .totalPrice(totalPrice)
            .finalPrice(finalPrice)
            .province(command.province())
            .district(command.district())
            .ward(command.ward())
            .addressDetail(command.addressDetail())
            .shippingAddress(command.shippingAddress())
            .latitude(command.latitude())
            .longitude(command.longitude())
            .orderDetails(new ArrayList<>())
            .orderLogs(new ArrayList<>())
            .build();

        orderDetail.setOrder(order);
        order.getOrderDetails().add(orderDetail);
        appendLog(order, null, Orders.OrderStatus.RESERVED, command.changedBy(), "Stock reserved for box components");

        Orders savedOrder = ordersRepo.save(order);
        componentInventoryService.reserveComponents(variant.getId(), command.quantity(), savedOrder.getId(), "Order reserve");
        return savedOrder;
    }

    @Transactional
    public Orders cancelOrder(Long orderId, Long changedBy) {
        Orders order = ordersRepo.findById(orderId)
            .orElseThrow(() -> new EntityNotFoundException("Order not found: " + orderId));

        if (order.getStatus() == Orders.OrderStatus.CANCELLED || order.getStatus() == Orders.OrderStatus.COMPLETED) {
            throw new IllegalStateException("Order cannot be cancelled from status " + order.getStatus());
        }

        if (order.getStatus() == Orders.OrderStatus.RESERVED || order.getStatus() == Orders.OrderStatus.CONFIRMED) {
            for (OrderDetail detail : order.getOrderDetails()) {
                componentInventoryService.releaseComponents(detail.getProductVariant().getId(), detail.getQuantity(), order.getId(), "Order cancelled");
            }
        }

        Orders.OrderStatus oldStatus = order.getStatus();
        order.setStatus(Orders.OrderStatus.CANCELLED);
        appendLog(order, oldStatus, Orders.OrderStatus.CANCELLED, changedBy, "Order cancelled and stock released");
        return ordersRepo.save(order);
    }

    @Transactional
    public Orders startPacking(Long orderId, Long changedBy) {
        Orders order = ordersRepo.findById(orderId)
            .orElseThrow(() -> new EntityNotFoundException("Order not found: " + orderId));

        if (order.getStatus() != Orders.OrderStatus.RESERVED && order.getStatus() != Orders.OrderStatus.CONFIRMED) {
            throw new IllegalStateException("Order must be reserved before packing");
        }

        for (OrderDetail detail : order.getOrderDetails()) {
            componentInventoryService.consumeReservedComponents(detail.getProductVariant().getId(), detail.getQuantity(), order.getId(), "Order packing");
        }

        Orders.OrderStatus oldStatus = order.getStatus();
        order.setStatus(Orders.OrderStatus.PACKING);
        appendLog(order, oldStatus, Orders.OrderStatus.PACKING, changedBy, "Packing started and stock consumed");
        return ordersRepo.save(order);
    }

    private BigDecimal applyVoucher(BigDecimal totalPrice, Voucher voucher) {
        if (voucher == null || voucher.getStatus() != Voucher.VoucherStatus.ACTIVE) {
            return totalPrice;
        }
        if (voucher.getMinOrderValue() != null && totalPrice.compareTo(voucher.getMinOrderValue()) < 0) {
            return totalPrice;
        }

        BigDecimal discounted = switch (voucher.getDiscountType()) {
            case FIXED -> totalPrice.subtract(voucher.getDiscountValue());
            case PERCENT -> {
                BigDecimal discount = totalPrice.multiply(voucher.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                if (voucher.getMaxDiscount() != null && discount.compareTo(voucher.getMaxDiscount()) > 0) {
                    discount = voucher.getMaxDiscount();
                }
                yield totalPrice.subtract(discount);
            }
        };

        if (discounted.signum() < 0) {
            return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }
        return discounted;
    }

    private String toSnapshotJson(List<ProductVariantComponent> components) {
        List<ComponentSnapshot> snapshots = components.stream()
            .map(component -> new ComponentSnapshot(
                component.getComponentItem().getId(),
                component.getComponentItem().getSku(),
                component.getComponentItem().getName(),
                component.getComponentItem().getComponentType().name(),
                component.getQuantity(),
                component.getSortOrder()
            ))
            .toList();

        try {
            return objectMapper.writeValueAsString(snapshots);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Failed to serialize order component snapshot", exception);
        }
    }

    private void appendLog(Orders order,
                           Orders.OrderStatus oldStatus,
                           Orders.OrderStatus newStatus,
                           Long changedBy,
                           String note) {
        if (order.getOrderLogs() == null) {
            order.setOrderLogs(new ArrayList<>());
        }

        order.getOrderLogs().add(OrderLog.builder()
            .order(order)
            .oldStatus(oldStatus == null ? null : oldStatus.name())
            .newStatus(newStatus.name())
            .changedBy(changedBy)
            .note(note)
            .build());
    }

    public record CreateBoxOrderCommand(
        Long accountId,
        Long productVariantId,
        Integer quantity,
        Long voucherId,
        String province,
        String district,
        String ward,
        String addressDetail,
        String shippingAddress,
        BigDecimal latitude,
        BigDecimal longitude,
        Long changedBy
    ) {
    }

    private record ComponentSnapshot(
        Long componentId,
        String sku,
        String name,
        String componentType,
        Integer quantity,
        Integer sortOrder
    ) {
    }
}
