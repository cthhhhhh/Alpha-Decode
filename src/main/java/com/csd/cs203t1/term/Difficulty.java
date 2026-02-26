package com.csd.cs203t1.term;

public enum Difficulty {
	//add new difficulties here
	EASY,
	MEDIUM,
	HARD;

	//makes it return to frontend as lowercase
	@Override
    public String toString() {
        return name().toLowerCase();
    }
}
