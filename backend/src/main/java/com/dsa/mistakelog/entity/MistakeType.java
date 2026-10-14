package com.dsa.mistakelog.entity;

public enum MistakeType {
    WRONG_ALGORITHM("Wrong algorithm / assumption"),
    IMPLEMENTATION_SYNTAX("Implementation / syntax"),
    EDGE_CASE("Edge case"),
    TIME_COMPLEXITY("Time complexity"),
    SPACE_COMPLEXITY("Space complexity"),
    MISUNDERSTOOD_PROBLEM("Misunderstood problem"),
    OTHER("Other");

    private final String displayName;

    MistakeType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static MistakeType fromString(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        for (MistakeType type : MistakeType.values()) {
            if (type.name().equalsIgnoreCase(value.trim()) ||
                type.displayName.equalsIgnoreCase(value.trim())) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown mistake type: " + value);
    }
}
