package com.csd.cs203t1.user;

import com.csd.cs203t1.common.Role;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@DisplayName("UserRepository JPA Tests (H2)")
class UserRepositoryTest {

    @Autowired
    private TestEntityManager em;

    @Autowired
    private UserRepository userRepository;

    // ─── Helpers ────────────────────────────────────────────────────────────────

    private User createUser(String username, String email, Role role) {
        User u = new User();
        u.setUsername(username);
        u.setEmail(email);
        u.setPassword("hashed");
        u.setRole(role);
        u.setEnabled(true);
        u.setPendingApproval(false);
        return em.persistFlushFind(u);
    }

    // ─── findByUsername ───────────────────────────────────────────────────────────

    @Test
    @DisplayName("findByUsername: existing user — returns Optional with user")
    void findByUsername_existingUser_returnsUser() {
        createUser("alice", "alice@example.com", Role.USER);

        Optional<User> found = userRepository.findByUsername("alice");

        assertTrue(found.isPresent());
        assertEquals("alice", found.get().getUsername());
        assertEquals("alice@example.com", found.get().getEmail());
    }

    @Test
    @DisplayName("findByUsername: non-existent user — returns empty Optional")
    void findByUsername_notFound_returnsEmpty() {
        Optional<User> found = userRepository.findByUsername("nobody");

        assertFalse(found.isPresent());
    }

    // ─── findByEmail ───────────────────────────────────────────────────────────────

    @Test
    @DisplayName("findByEmail: existing user — returns Optional with user")
    void findByEmail_existingUser_returnsUser() {
        createUser("bob", "bob@example.com", Role.USER);

        Optional<User> found = userRepository.findByEmail("bob@example.com");

        assertTrue(found.isPresent());
        assertEquals("bob", found.get().getUsername());
    }

    @Test
    @DisplayName("findByEmail: non-existent email — returns empty Optional")
    void findByEmail_notFound_returnsEmpty() {
        Optional<User> found = userRepository.findByEmail("ghost@example.com");

        assertFalse(found.isPresent());
    }

    // ─── existsByUsername / existsByEmail ─────────────────────────────────────────

    @Test
    @DisplayName("existsByUsername: saved user — returns true")
    void existsByUsername_saved_returnsTrue() {
        createUser("charlie", "charlie@example.com", Role.USER);

        assertTrue(userRepository.existsByUsername("charlie"));
    }

    @Test
    @DisplayName("existsByUsername: missing user — returns false")
    void existsByUsername_missing_returnsFalse() {
        assertFalse(userRepository.existsByUsername("ghost"));
    }

    @Test
    @DisplayName("existsByEmail: saved email — returns true")
    void existsByEmail_saved_returnsTrue() {
        createUser("dave", "dave@example.com", Role.USER);

        assertTrue(userRepository.existsByEmail("dave@example.com"));
    }

    @Test
    @DisplayName("existsByEmail: missing email — returns false")
    void existsByEmail_missing_returnsFalse() {
        assertFalse(userRepository.existsByEmail("ghost@example.com"));
    }

    // ─── countByRole ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("countByRole: counts only users of the given role")
    void countByRole_correctCount() {
        createUser("u1", "u1@example.com", Role.USER);
        createUser("u2", "u2@example.com", Role.USER);
        createUser("a1", "a1@example.com", Role.ADMIN);

        assertEquals(2, userRepository.countByRole(Role.USER));
        assertEquals(1, userRepository.countByRole(Role.ADMIN));
        assertEquals(0, userRepository.countByRole(Role.CONTRIBUTOR));
    }

    // ─── findByRoleAndEnabled ─────────────────────────────────────────────────────

    @Test
    @DisplayName("findByRoleAndEnabled: returns only enabled users of given role")
    void findByRoleAndEnabled_filtersCorrectly() {
        createUser("active", "active@example.com", Role.CONTRIBUTOR);

        User pending = new User();
        pending.setUsername("pending");
        pending.setEmail("pending@example.com");
        pending.setPassword("hashed");
        pending.setRole(Role.CONTRIBUTOR);
        pending.setEnabled(false);
        pending.setPendingApproval(true);
        em.persistAndFlush(pending);

        List<User> enabled = userRepository.findByRoleAndEnabled(Role.CONTRIBUTOR, true);
        List<User> disabled = userRepository.findByRoleAndEnabled(Role.CONTRIBUTOR, false);

        assertEquals(1, enabled.size());
        assertEquals("active", enabled.get(0).getUsername());
        assertEquals(1, disabled.size());
        assertEquals("pending", disabled.get(0).getUsername());
    }

    // ─── findByRoleAndPendingApprovalTrue ─────────────────────────────────────────

    @Test
    @DisplayName("findByRoleAndPendingApprovalTrue: returns only pending users of given role")
    void findByRoleAndPendingApprovalTrue_returnsOnlyPending() {
        // approved contributor
        createUser("approved", "approved@example.com", Role.CONTRIBUTOR);

        // pending contributor
        User pending = new User();
        pending.setUsername("waiting");
        pending.setEmail("waiting@example.com");
        pending.setPassword("hashed");
        pending.setRole(Role.CONTRIBUTOR);
        pending.setEnabled(false);
        pending.setPendingApproval(true);
        em.persistAndFlush(pending);

        List<User> result = userRepository.findByRoleAndPendingApprovalTrue(Role.CONTRIBUTOR);

        assertEquals(1, result.size());
        assertEquals("waiting", result.get(0).getUsername());
    }

    // ─── resetAllWeeklyCoins ──────────────────────────────────────────────────────

    @Test
    @DisplayName("resetAllWeeklyCoins: sets all users' weeklyCoins to 0")
    void resetAllWeeklyCoins_setsToZero() {
        User u = createUser("rich", "rich@example.com", Role.USER);
        u.setWeeklyCoins(500);
        em.persistAndFlush(u);

        userRepository.resetAllWeeklyCoins();
        em.clear(); // evict L1 cache so we re-read from DB

        User updated = userRepository.findByUsername("rich").orElseThrow();
        assertEquals(0, updated.getWeeklyCoins());
    }

    // ─── save and findById ────────────────────────────────────────────────────────

    @Test
    @DisplayName("save: persists a new user and assigns an ID")
    void save_newUser_persistsWithId() {
        User u = new User();
        u.setUsername("eve");
        u.setEmail("eve@example.com");
        u.setPassword("hashed");
        u.setRole(Role.USER);
        u.setEnabled(true);

        User saved = userRepository.save(u);

        assertNotNull(saved.getId());
        assertEquals("eve", saved.getUsername());
    }

    @Test
    @DisplayName("delete: removes user from repository")
    void delete_existingUser_removesFromDb() {
        User u = createUser("frank", "frank@example.com", Role.USER);
        Long id = u.getId();

        userRepository.delete(u);
        em.flush();

        assertFalse(userRepository.findById(id).isPresent());
    }
}
