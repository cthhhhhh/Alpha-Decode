package com.csd.cs203t1.flag;

import com.csd.cs203t1.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "flags")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Flag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContentType contentType;

    @Column(nullable = false)
    private Long contentId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FlagReason reason;

    @Column(length = 500)
    private String details;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reported_by_id", nullable = false)
    private User reportedBy;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private FlagStatus status = FlagStatus.PENDING;
}
