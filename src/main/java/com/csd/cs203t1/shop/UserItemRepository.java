package com.csd.cs203t1.shop;

import com.csd.cs203t1.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserItemRepository extends JpaRepository<UserItem, Long> {
    List<UserItem> findByUser(User user);
    boolean existsByUserAndItem(User user, Item item);
    void deleteByUser(User user);
}
