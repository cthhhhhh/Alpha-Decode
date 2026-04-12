package com.csd.cs203t1.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import io.jsonwebtoken.ExpiredJwtException;

@DisplayName("JwtUtil Unit Tests")
class JwtUtilTest {

    @Test
    @DisplayName("generateToken and validateToken succeed for matching user")
    void generateAndValidate_matchingUser_success() {
        JwtUtil jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", "01234567890123456789012345678901");
        ReflectionTestUtils.setField(jwtUtil, "expirationMs", 60_000L);

        UserDetails user = User.withUsername("alice")
                .password("ignored")
                .roles("USER")
                .build();

        String token = jwtUtil.generateToken(user);

        assertTrue(jwtUtil.validateToken(token, user));
        assertEquals("alice", jwtUtil.extractUsername(token));
        assertEquals("ROLE_USER", jwtUtil.extractRole(token));
    }

    @Test
    @DisplayName("validateToken fails for non-matching user")
    void validateToken_mismatchedUser_false() {
        JwtUtil jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", "01234567890123456789012345678901");
        ReflectionTestUtils.setField(jwtUtil, "expirationMs", 60_000L);

        UserDetails alice = User.withUsername("alice").password("x").roles("USER").build();
        UserDetails bob = User.withUsername("bob").password("x").roles("USER").build();

        String token = jwtUtil.generateToken(alice);

        assertFalse(jwtUtil.validateToken(token, bob));
    }

    @Test
    @DisplayName("validateToken throws when token is expired")
    void validateToken_expired_throws() {
        JwtUtil jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", "01234567890123456789012345678901");
        ReflectionTestUtils.setField(jwtUtil, "expirationMs", -1L);

        UserDetails user = User.withUsername("alice").password("x").roles("USER").build();
        String token = jwtUtil.generateToken(user);

        ExpiredJwtException ex = assertThrows(ExpiredJwtException.class, () -> jwtUtil.validateToken(token, user));
        assertTrue(ex.getMessage().contains("JWT expired"));
    }
}
