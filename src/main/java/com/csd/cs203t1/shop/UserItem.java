package com.csd.cs203t1.shop;

import com.csd.cs203t1.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_items", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "item_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;
}
