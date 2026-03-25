package com.csd.cs203t1.bookmark;

import com.csd.cs203t1.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserBookmarkRepository extends JpaRepository<UserBookmark, Long> {
    List<UserBookmark> findByUser(User user);
    Optional<UserBookmark> findByUserAndTermId(User user, Long termId);
    void deleteByUserAndTermId(User user, Long termId);
}
