package com.csd.cs203t1.user;

import java.util.List;
import java.util.Map;

public interface LeaderboardService {
    List<LeaderboardEntryDTO> getLeaderboard(int limit, String period, String sort);
    Map<String, Object> getMyRank(String period, String sort);
}
