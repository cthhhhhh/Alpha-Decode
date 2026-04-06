package com.csd.cs203t1.draft;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface DraftRepository extends JpaRepository<Draft, Long> {
    List<Draft> findByContributorId(Long contributorId);
    List<Draft> findByStatus(DraftStatus status);
    Optional<Draft> findByApprovedLessonId(Long lessonId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Draft d WHERE d.contributorId = :contributorId")
    void deleteByContributorId(Long contributorId);
}
