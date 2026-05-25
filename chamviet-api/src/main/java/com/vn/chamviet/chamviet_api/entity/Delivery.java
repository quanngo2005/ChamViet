package com.vn.chamviet.chamviet_api.entity;

import com.vn.chamviet.chamviet_api.order.Orders;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "delivery")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Orders order;

    @Column(length = 100)
    private String provider;

    @Column(name = "tracking_code", length = 100)
    private String trackingCode;

    @Column(name = "shipping_fee", precision = 15, scale = 2)
    private BigDecimal shippingFee;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('PENDING','IN_TRANSIT','DELIVERED','RETURNED') DEFAULT 'PENDING'")
    private DeliveryStatus status = DeliveryStatus.PENDING;

    @Column(name = "cod_amount")
    private Integer codAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "cod_status")
    private CodStatus codStatus;

    public enum DeliveryStatus {
        PENDING, IN_TRANSIT, DELIVERED, RETURNED
    }

    public enum CodStatus {
        PENDING, COLLECTED, TRANSFERRED
    }
}
