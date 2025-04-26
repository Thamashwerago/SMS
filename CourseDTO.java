package com.qslab.sms.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.Set;

@Getter
@Setter
public class CourseDTO {
    private Long id;
    private String courseName;
    private String syllabus;
    private int maxCapacity;
    private Long teacherId;
    private Set<Long> studentIds;
}
