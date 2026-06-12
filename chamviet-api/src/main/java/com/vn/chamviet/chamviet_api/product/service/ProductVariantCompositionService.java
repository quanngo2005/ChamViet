package com.vn.chamviet.chamviet_api.product.service;

import com.vn.chamviet.chamviet_api.product.Component;
import com.vn.chamviet.chamviet_api.product.ProductVariant;
import com.vn.chamviet.chamviet_api.product.ProductVariantComponent;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductVariantCompositionService {
    public void validateBoxVariant(ProductVariant variant) {
        validateComponents(variant.getComponents());
        if (variant.getComponentCount() != null && variant.getComponents() != null
            && variant.getComponents().size() != variant.getComponentCount()) {
            throw new IllegalArgumentException("Variant component row count must match componentCount");
        }
    }

    public void validateComponents(List<ProductVariantComponent> components) {
        if (components == null || components.isEmpty()) {
            throw new IllegalArgumentException("Box variant must declare its components");
        }

        int totalPuzzle = 0;
        int totalPepperGhost = 0;

        for (ProductVariantComponent component : components) {
            if (component.getComponent() == null) {
                throw new IllegalArgumentException("Component reference is required");
            }
            if (component.getQuantity() == null || component.getQuantity() <= 0) {
                throw new IllegalArgumentException("Component quantity must be greater than 0");
            }

            if (component.getComponent().getComponentType() == Component.ComponentType.PUZZLE) {
                totalPuzzle += component.getQuantity();
            } else if (component.getComponent().getComponentType() == Component.ComponentType.PEPPER_GHOST) {
                totalPepperGhost += component.getQuantity();
            }
        }

        if (totalPuzzle != 2) {
            throw new IllegalArgumentException("A box SKU must contain exactly 2 puzzle components");
        }
        if (totalPepperGhost != 1) {
            throw new IllegalArgumentException("A box SKU must contain exactly 1 pepper ghost component");
        }
    }
}
