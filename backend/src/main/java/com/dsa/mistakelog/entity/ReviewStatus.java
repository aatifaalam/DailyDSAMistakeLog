package com.dsa.mistakelog.entity;

public enum ReviewStatus {
    NOT_REVIEWED("Not reviewed"),
    NEEDS_ANOTHER_REVIEW("Needs another review"),
    REVIEWED("Reviewed");

    private final String displayName;

    ReviewStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static ReviewStatus fromString(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        for (ReviewStatus status : ReviewStatus.values()) {
            if (status.name().equalsIgnoreCase(value.trim()) ||
                status.displayName.equalsIgnoreCase(value.trim())) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown review status: " + value);
    }
}
