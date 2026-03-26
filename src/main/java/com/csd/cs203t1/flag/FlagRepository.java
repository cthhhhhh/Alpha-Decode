package com.csd.cs203t1.flag;

import com.csd.cs203t1.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FlagRepository extends JpaRepository<Flag, Long> {
    List<Flag> findAllByOrderByCreatedAtDesc();
    Optional<Flag> findByReportedByAndContentTypeAndContentId(User user, ContentType contentType, Long contentId);
    List<Flag> findByReportedBy(User user);
    void deleteByReportedBy(User user);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    void deleteByStatus(FlagStatus status);
}
