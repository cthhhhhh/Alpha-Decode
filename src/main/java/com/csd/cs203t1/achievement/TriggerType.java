package com.csd.cs203t1.achievement;

public enum TriggerType {
    LESSON_COMPLETE,
    STREAK_DAYS,
    DAILY_QUIZ_COUNT,
    XP_REACHED;

    @Override
    public String toString() {
        return name().toLowerCase();
    }
}
