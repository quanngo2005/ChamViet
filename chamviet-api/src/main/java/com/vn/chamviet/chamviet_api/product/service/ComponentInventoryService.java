package com.vn.chamviet.chamviet_api.product.service;

import com.vn.chamviet.chamviet_api.entity.InventoryTransaction;
import com.vn.chamviet.chamviet_api.entity.repository.InventoryTransactionRepo;
import com.vn.chamviet.chamviet_api.product.Component;
import com.vn.chamviet.chamviet_api.product.ProductVariant;
import com.vn.chamviet.chamviet_api.product.ProductVariantComponent;
import com.vn.chamviet.chamviet_api.product.repository.ComponentRepo;
import com.vn.chamviet.chamviet_api.product.repository.ProductVariantRepo;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ComponentInventoryService {
    private final ProductVariantRepo productVariantRepo;
    private final ComponentRepo componentRepo;
    private final InventoryTransactionRepo inventoryTransactionRepo;
    private final ProductVariantCompositionService compositionService;

    @Transactional
    public void reserveComponents(Long productVariantId, int boxQuantity, Long referenceId, String note) {
        applyInventoryMovement(productVariantId, boxQuantity, referenceId, note, InventoryTransaction.TransactionType.RESERVE);
    }

    @Transactional
    public void releaseComponents(Long productVariantId, int boxQuantity, Long referenceId, String note) {
        applyInventoryMovement(productVariantId, boxQuantity, referenceId, note, InventoryTransaction.TransactionType.RELEASE);
    }

    @Transactional
    public void consumeReservedComponents(Long productVariantId, int boxQuantity, Long referenceId, String note) {
        applyInventoryMovement(productVariantId, boxQuantity, referenceId, note, InventoryTransaction.TransactionType.CONSUME);
    }

    private void applyInventoryMovement(Long productVariantId,
                                        int boxQuantity,
                                        Long referenceId,
                                        String note,
                                        InventoryTransaction.TransactionType movementType) {
        if (boxQuantity <= 0) {
            throw new IllegalArgumentException("Box quantity must be greater than 0");
        }

        ProductVariant variant = productVariantRepo.findDetailedById(productVariantId)
            .orElseThrow(() -> new EntityNotFoundException("Product variant not found: " + productVariantId));
        compositionService.validateBoxVariant(variant);

        Map<Long, Integer> requiredByComponentId = new HashMap<>();
        for (ProductVariantComponent component : variant.getComponents()) {
            requiredByComponentId.merge(
                component.getComponent().getId(),
                component.getQuantity() * boxQuantity,
                Integer::sum
            );
        }

        List<Component> lockedComponents = componentRepo.findAllByIdInForUpdate(requiredByComponentId.keySet());
        if (lockedComponents.size() != requiredByComponentId.size()) {
            throw new EntityNotFoundException("One or more components are missing");
        }

        for (Component component : lockedComponents) {
            int required = requiredByComponentId.get(component.getId());
            switch (movementType) {
                case RESERVE -> reserve(component, required);
                case RELEASE -> release(component, required);
                case CONSUME -> consume(component, required);
                default -> throw new IllegalArgumentException("Unsupported movement type: " + movementType);
            }

            inventoryTransactionRepo.save(InventoryTransaction.builder()
                .component(component)
                .type(movementType)
                .quantity(required)
                .referenceId(referenceId)
                .note(note)
                .build());
        }
    }

    private void reserve(Component component, int required) {
        int available = component.getStockOnHand() - component.getReservedStock();
        if (available < required) {
            throw new IllegalStateException("Insufficient component stock for " + component.getSku());
        }
        component.setReservedStock(component.getReservedStock() + required);
    }

    private void release(Component component, int required) {
        if (component.getReservedStock() < required) {
            throw new IllegalStateException("Reserved stock cannot go below zero for " + component.getSku());
        }
        component.setReservedStock(component.getReservedStock() - required);
    }

    private void consume(Component component, int required) {
        if (component.getReservedStock() < required) {
            throw new IllegalStateException("Reserved stock is insufficient for consume on " + component.getSku());
        }
        if (component.getStockOnHand() < required) {
            throw new IllegalStateException("On-hand stock is insufficient for consume on " + component.getSku());
        }
        component.setReservedStock(component.getReservedStock() - required);
        component.setStockOnHand(component.getStockOnHand() - required);
    }
}
