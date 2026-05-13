package com.vn.chamviet.chamviet_api.entity;

import com.vn.chamviet.chamviet_api.product.ProductVariant;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_detail")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
public class OrderDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    @ToString.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Orders order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_variant_id", nullable = false)
    private ProductVariant productVariant;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "snapshot_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal snapshotPrice;

    @Column(name = "snapshot_product_name", nullable = false, length = 255)
    private String snapshotProductName;

    @Column(name = "snapshot_variant_sku", nullable = false, length = 100)
    private String snapshotVariantSku;

    @Column(name = "snapshot_components_json", columnDefinition = "TEXT")
    private String snapshotComponentsJson;
}
