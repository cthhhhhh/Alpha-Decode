package com.csd.cs203t1.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LeaderboardEntryDTO {
    private int rank;
    private String username;
    private int level;
    private int coins;
    private int streak;
}
