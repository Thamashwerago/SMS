package com.qslab.sms.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String courseName;

    @Column(length = 500)
    private String syllabus;

    private int maxCapacity;

    private Long teacherId; // Foreign key (from Teacher Table)

    @ElementCollection
    private Set<Long> studentIds = new HashSet<>(); // Store Student IDs
}
