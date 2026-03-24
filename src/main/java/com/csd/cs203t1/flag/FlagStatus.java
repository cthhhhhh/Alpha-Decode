package com.csd.cs203t1.flag;

public enum FlagStatus {
    PENDING, REVIEWED, DISMISSED;

    @Override
    public String toString() {
        return name().toLowerCase();
    }
}
