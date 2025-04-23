package com.qslabs.sms.dto;

public class AttendanceSummaryDTO {
    private Long userId;
    private String role;
    private Long courseId;
    private Long totalCount;
    private Long presentCount;
    private Long absentCount;
    private Double attendancePercentage;

    public AttendanceSummaryDTO(Long userId, String role, Long courseId, Long totalCount, Long presentCount) {
        this.userId = userId;
        this.role = role;
        this.courseId = courseId;
        this.totalCount = totalCount;
        this.presentCount = presentCount;
        this.absentCount = totalCount - presentCount;
        this.attendancePercentage = totalCount == 0 ? 0.0 : ((presentCount * 100.0) / totalCount);
    }

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public Long getTotalCount() { return totalCount; }
    public void setTotalCount(Long totalCount) { this.totalCount = totalCount; }

    public Long getPresentCount() { return presentCount; }
    public void setPresentCount(Long presentCount) { this.presentCount = presentCount; }

    public Long getAbsentCount() { return absentCount; }
    public void setAbsentCount(Long absentCount) { this.absentCount = absentCount; }

    public Double getAttendancePercentage() { return attendancePercentage; }
    public void setAttendancePercentage(Double attendancePercentage) { this.attendancePercentage = attendancePercentage; }
}
