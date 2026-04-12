package com.csd.cs203t1.flag;

import java.util.List;

import com.csd.cs203t1.user.User;

public interface FlagService {
    FlagDTO.FlagResponse createFlag(FlagDTO.CreateFlagRequest request, User reporter);
    List<FlagDTO.FlagResponse> getAllFlags();
    FlagDTO.FlagResponse updateStatus(Long flagId, String status);
    boolean hasUserFlagged(User user, String contentType, Long contentId);
    List<String> getFlagReasons();
    void deleteFlag(Long id);
    void deleteResolvedFlags();
}
