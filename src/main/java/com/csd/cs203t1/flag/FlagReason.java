package com.csd.cs203t1.flag;

public enum FlagReason {
    INCORRECT_DEFINITION,
    INAPPROPRIATE_CONTENT,
    OUTDATED_INFORMATION,
    MISLEADING_EXAMPLE,
    SPAM,
    OTHER;

    @Override
    public String toString() {
        return name().toLowerCase();
    }
}
