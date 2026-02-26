package com.csd.cs203t1.term;

public enum Category {
	ADJECTIVE,
	REACTION,
	NOUN;
	@Override
    public String toString() {
        return name().toLowerCase();
    }
}
