package com.csd.cs203t1.flag;

public enum ContentType {
    LESSON, TERM, QUESTION;

    @Override
    public String toString() {
        return name().toLowerCase();
    }
}
