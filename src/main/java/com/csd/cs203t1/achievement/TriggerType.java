package com.csd.cs203t1.achievement;

public enum TriggerType {
    LESSON_COMPLETE,
    XP_REACHED,
    STREAK_DAYS,
    DAILY_QUIZ_COUNT,
    COINS_REACHED;

    @Override
    public String toString() {
        return name().toLowerCase();
    }
}
