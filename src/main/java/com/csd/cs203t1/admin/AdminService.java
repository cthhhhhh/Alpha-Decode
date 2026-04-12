package com.csd.cs203t1.admin;

import java.util.List;
import java.util.Map;

public interface AdminService {
    Map<String, Object> getAdminStats();
    List<Map<String, Object>> getAllUsers();
    void updateUserRole(Long id, String newRoleStr);
    void approveContributor(Long id);
    void rejectContributor(Long id);
    List<Map<String, Object>> getPendingContributors();
    Map<String, Object> getUserStats(Long id);
}
