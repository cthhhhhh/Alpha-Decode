package com.csd.cs203t1.security;

import org.junit.jupiter.api.AfterEach;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import com.csd.cs203t1.admin.SessionTracker;

import jakarta.servlet.FilterChain;

@ExtendWith(MockitoExtension.class)
@DisplayName("JwtFilter Unit Tests")
class JwtFilterTest {

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private CustomUserDetailsService userDetailsService;

    @Mock
    private SessionTracker sessionTracker;

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("doFilter authenticates request for valid bearer token")
    void doFilter_validToken_setsAuthentication() throws Exception {
        JwtFilter filter = new JwtFilter(jwtUtil, userDetailsService, sessionTracker);

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer token123");
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = new MockFilterChain();

        UserDetails userDetails = User.withUsername("alice").password("x").roles("USER").build();

        when(jwtUtil.extractUsername("token123")).thenReturn("alice");
        when(userDetailsService.loadUserByUsername("alice")).thenReturn(userDetails);
        when(jwtUtil.validateToken("token123", userDetails)).thenReturn(true);

        filter.doFilter(request, response, chain);

        assertNotNull(SecurityContextHolder.getContext().getAuthentication());
        assertEquals("alice", SecurityContextHolder.getContext().getAuthentication().getName());
        verify(sessionTracker).recordActivity("alice");
    }

    @Test
    @DisplayName("doFilter continues without auth when token parsing fails")
    void doFilter_invalidToken_noAuthentication() throws Exception {
        JwtFilter filter = new JwtFilter(jwtUtil, userDetailsService, sessionTracker);

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer bad");
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = new MockFilterChain();

        when(jwtUtil.extractUsername("bad")).thenThrow(new RuntimeException("Invalid token"));

        filter.doFilter(request, response, chain);

        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }
}
