package com.csd.cs203t1.flag;

public enum FlagStatus {
    PENDING, REVIEWED, DISMISSED, RESOLVED;

    @Override
    public String toString() {
        return name().toLowerCase();
    }
}
