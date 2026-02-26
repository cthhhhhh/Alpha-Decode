package com.csd.cs203t1.common;

public enum Role {
	USER,
	ADMIN,
	CONTRIBUTOR;
	@Override
    public String toString() {
        return name().toLowerCase();
    }
}
