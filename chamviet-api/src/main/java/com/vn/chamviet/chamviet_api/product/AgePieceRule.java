package com.vn.chamviet.chamviet_api.product;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "age_piece_rule")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgePieceRule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "age_range_id", nullable = false)
    private AgeRange ageRange;

    @Column(name = "recommended_piece_count", nullable = false)
    private Integer recommendedPieceCount;

    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty_level")
    private DifficultyLevel difficultyLevel;

    public enum DifficultyLevel {
        EASY, MEDIUM, HARD
    }
}
