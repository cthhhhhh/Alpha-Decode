package com.csd.cs203t1.admin;

import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;

@Component
public class SessionTracker {
    private final ConcurrentHashMap<String, Long> activeUsers = new ConcurrentHashMap<>();
    private static final long SESSION_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes

    public boolean isOnline(String username) {
        if (username == null) return false;
        Long lastSeen = activeUsers.get(username);
        return lastSeen != null && (System.currentTimeMillis() - lastSeen <= SESSION_TIMEOUT_MS);
    }

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
