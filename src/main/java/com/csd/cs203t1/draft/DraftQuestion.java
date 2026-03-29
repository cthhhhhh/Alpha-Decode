package com.csd.cs203t1.draft;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "draft_questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DraftQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "draft_id", nullable = false)
    @JsonBackReference
    private LessonDraft draft;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String questionJson;

    @Column(nullable = false)
    private Integer questionOrder;
}
