package com.csd.cs203t1.flag;

import com.csd.cs203t1.user.User;

import java.util.Arrays;
import java.util.List;

public interface FlagService {
    FlagDTO.FlagResponse createFlag(FlagDTO.CreateFlagRequest request, User reporter);
    List<FlagDTO.FlagResponse> getAllFlags();
    FlagDTO.FlagResponse updateStatus(Long flagId, String status);
    boolean hasUserFlagged(User user, String contentType, Long contentId);

    static List<String> getFlagReasons() {
        return Arrays.stream(FlagReason.values())
                .map(FlagReason::name)
                .toList();
    }
}
