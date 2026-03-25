package com.csd.cs203t1.bookmark;

import com.csd.cs203t1.term.Term;
import com.csd.cs203t1.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "term_id"}))
public class UserBookmark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "term_id", nullable = false)
    private Term term;

    @Column(nullable = false)
    private LocalDateTime savedAt;

    @PrePersist
    public void prePersist() {
        savedAt = LocalDateTime.now();
    }
}
