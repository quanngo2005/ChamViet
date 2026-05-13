package com.vn.chamviet.chamviet_api.product.service;

import com.vn.chamviet.chamviet_api.entity.InventoryTransaction;
import com.vn.chamviet.chamviet_api.entity.repository.InventoryTransactionRepo;
import com.vn.chamviet.chamviet_api.product.ComponentItem;
import com.vn.chamviet.chamviet_api.product.ProductVariant;
import com.vn.chamviet.chamviet_api.product.ProductVariantComponent;
import com.vn.chamviet.chamviet_api.product.repository.ComponentItemRepo;
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
    private final ComponentItemRepo componentItemRepo;
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
                component.getComponentItem().getId(),
                component.getQuantity() * boxQuantity,
                Integer::sum
            );
        }

        List<ComponentItem> lockedComponents = componentItemRepo.findAllByIdInForUpdate(requiredByComponentId.keySet());
        if (lockedComponents.size() != requiredByComponentId.size()) {
            throw new EntityNotFoundException("One or more components are missing");
        }

        for (ComponentItem componentItem : lockedComponents) {
            int required = requiredByComponentId.get(componentItem.getId());
            switch (movementType) {
                case RESERVE -> reserve(componentItem, required);
                case RELEASE -> release(componentItem, required);
                case CONSUME -> consume(componentItem, required);
                default -> throw new IllegalArgumentException("Unsupported movement type: " + movementType);
            }

            inventoryTransactionRepo.save(InventoryTransaction.builder()
                .componentItem(componentItem)
                .type(movementType)
                .quantity(required)
                .referenceId(referenceId)
                .note(note)
                .build());
        }
    }

    private void reserve(ComponentItem componentItem, int required) {
        int available = componentItem.getStockOnHand() - componentItem.getReservedStock();
        if (available < required) {
            throw new IllegalStateException("Insufficient component stock for " + componentItem.getSku());
        }
        componentItem.setReservedStock(componentItem.getReservedStock() + required);
    }

    private void release(ComponentItem componentItem, int required) {
        if (componentItem.getReservedStock() < required) {
            throw new IllegalStateException("Reserved stock cannot go below zero for " + componentItem.getSku());
        }
        componentItem.setReservedStock(componentItem.getReservedStock() - required);
    }

    private void consume(ComponentItem componentItem, int required) {
        if (componentItem.getReservedStock() < required) {
            throw new IllegalStateException("Reserved stock is insufficient for consume on " + componentItem.getSku());
        }
        if (componentItem.getStockOnHand() < required) {
            throw new IllegalStateException("On-hand stock is insufficient for consume on " + componentItem.getSku());
        }
        componentItem.setReservedStock(componentItem.getReservedStock() - required);
        componentItem.setStockOnHand(componentItem.getStockOnHand() - required);
    }
}
