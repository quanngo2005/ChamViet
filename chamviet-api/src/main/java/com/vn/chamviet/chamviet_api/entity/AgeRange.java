package com.vn.chamviet.chamviet_api.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "age_range")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgeRange {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 50)
    private String name;

    @Column(name = "min_age", nullable = false)
    private Integer minAge;

    @Column(name = "max_age", nullable = false)
    private Integer maxAge;
}
