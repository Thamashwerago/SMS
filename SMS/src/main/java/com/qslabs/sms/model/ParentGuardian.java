package com.qslabs.sms.model;

import com.qslabs.sms.util.Constants;
import jakarta.persistence.*;

/**
 * Entity class representing a Parent/Guardian.
 * This class is mapped to the database table defined in Constants.PARENT_TABLE.
 */
@Entity
@Table(name = Constants.PARENT_TABLE)
public class ParentGuardian {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long parentId;

    private String name;

    private String relationship;
    private String contactNumber;
    private String email;

    /**
     * Many-to-One relationship with Student.
     * Many ParentGuardian entries can be associated with a single Student.
     */
    @ManyToOne
    @JoinColumn(name = Constants.STUDENT_ID_COLUMN)
    private Student student;

    /**
     * Default constructor.
     */
    public ParentGuardian() {
    }

    /**
     * Parameterized constructor to initialize ParentGuardian with the specified values.
     *
     * @param id Unique identifier for the ParentGuardian.
     * @param name Name of the parent/guardian.
     * @param relationship Relationship with the student.
     * @param contactNumber Contact number of the parent/guardian.
     * @param email Email address of the parent/guardian.
     */
    public ParentGuardian(Long id, String name, String relationship, String contactNumber, String email) {
        this.parentId = id;
        this.name = name;
        this.relationship = relationship;
        this.contactNumber = contactNumber;
        this.email = email;
    }

    /**
     * Get the unique identifier of the parent/guardian.
     *
     * @return the parentId.
     */
    public Long getId() {
        return parentId;
    }

    /**
     * Set the unique identifier of the parent/guardian.
     *
     * @param id the parentId to set.
     */
    public void setId(Long id) {
        this.parentId = id;
    }

    /**
     * Get the name of the parent/guardian.
     *
     * @return the name.
     */
    public String getName() {
        return name;
    }

    /**
     * Set the name of the parent/guardian.
     *
     * @param name the name to set.
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Get the relationship with the student.
     *
     * @return the relationship.
     */
    public String getRelationship() {
        return relationship;
    }

    /**
     * Set the relationship with the student.
     *
     * @param relationship the relationship to set.
     */
    public void setRelationship(String relationship) {
        this.relationship = relationship;
    }

    /**
     * Get the contact number of the parent/guardian.
     *
     * @return the contact number.
     */
    public String getContactNumber() {
        return contactNumber;
    }

    /**
     * Set the contact number of the parent/guardian.
     *
     * @param contactNumber the contact number to set.
     */
    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    /**
     * Get the email address of the parent/guardian.
     *
     * @return the email address.
     */
    public String getEmail() {
        return email;
    }

    /**
     * Set the email address of the parent/guardian.
     *
     * @param email the email address to set.
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * Get the associated Student for this Parent/Guardian.
     *
     * @return the Student entity.
     */
    public Student getStudent() {
        return student;
    }

    /**
     * Set the associated Student for this Parent/Guardian.
     *
     * @param student the Student entity to associate.
     */
    public void setStudent(Student student) {
        this.student = student;
    }
}
