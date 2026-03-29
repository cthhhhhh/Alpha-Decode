package com.csd.cs203t1.draft;

import com.csd.cs203t1.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonDraftRepository extends JpaRepository<LessonDraft, Long> {

    List<LessonDraft> findByContributorOrderByUpdatedAtDesc(User contributor);

    List<LessonDraft> findByContributorAndStatusInOrderByUpdatedAtDesc(User contributor, List<DraftStatus> statuses);

    List<LessonDraft> findByStatusOrderByUpdatedAtAsc(DraftStatus status);

    long countByContributorAndStatus(User contributor, DraftStatus status);

    long countByStatus(DraftStatus status);

    Optional<LessonDraft> findByLessonId(Long lessonId);
}
