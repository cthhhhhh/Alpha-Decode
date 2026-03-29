package com.csd.cs203t1.draft;

import com.csd.cs203t1.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "lesson_drafts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonDraft {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String colour;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String story;

    @Column(nullable = false)
    private String emoji;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "contributor_id", nullable = false)
    private User contributor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private DraftStatus status = DraftStatus.DRAFT;

    @Column(columnDefinition = "TEXT")
    private String rejectionNote;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "draft", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("questionOrder ASC")
    @Builder.Default
    private List<DraftQuestion> questions = new ArrayList<>();
}
