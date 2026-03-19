package com.csd.cs203t1.admin;

import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;

@Component
public class SessionTracker {
    private final ConcurrentHashMap<String, Long> activeUsers = new ConcurrentHashMap<>();
    private static final long SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

    public void recordActivity(String username) {
        if (username != null) {
            activeUsers.put(username, System.currentTimeMillis());
        }
    }

    public long getActiveCount() {
        long now = System.currentTimeMillis();
        // Remove expired sessions
        activeUsers.entrySet().removeIf(entry -> now - entry.getValue() > SESSION_TIMEOUT_MS);
        return activeUsers.size();
    }
}
