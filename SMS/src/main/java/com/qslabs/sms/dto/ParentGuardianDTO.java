package com.qslabs.sms.dto;

/**
 * Data Transfer Object (DTO) for Parent/Guardian.
 * This class is used to transfer parent/guardian data between layers of the application.
 */
public class ParentGuardianDTO {

    private Long parentId;
    private String name;
    private String relationship;
    private String contactNumber;
    private String email;

    /**
     * Default constructor.
     */
    public ParentGuardianDTO() {
    }

    /**
     * Parameterized constructor for initializing ParentGuardianDTO.
     *
     * @param id Unique ID for the parent/guardian
     * @param name Name of the parent/guardian
     * @param relationship Relationship to the student
     * @param contactNumber Contact number of the parent/guardian
     * @param email Email address of the parent/guardian
     */
    public ParentGuardianDTO(Long id, String name, String relationship, String contactNumber, String email) {
        this.parentId = id;
        this.name = name;
        this.relationship = relationship;
        this.contactNumber = contactNumber;
        this.email = email;
    }

    /**
     * Gets the ID of the parent/guardian.
     *
     * @return id
     */
    public Long getId() {
        return parentId;
    }

    /**
     * Sets the ID of the parent/guardian.
     *
     * @param id Unique ID to set
     */
    public void setId(Long id) {
        this.parentId = id;
    }

    /**
     * Gets the name of the parent/guardian.
     *
     * @return name
     */
    public String getName() {
        return name;
    }

    /**
     * Sets the name of the parent/guardian.
     *
     * @param name Name to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Gets the relationship to the student.
     *
     * @return relationship
     */
    public String getRelationship() {
        return relationship;
    }

    /**
     * Sets the relationship to the student.
     *
     * @param relationship Relationship to set
     */
    public void setRelationship(String relationship) {
        this.relationship = relationship;
    }

    /**
     * Gets the contact number of the parent/guardian.
     *
     * @return contactNumber
     */
    public String getContactNumber() {
        return contactNumber;
    }

    /**
     * Sets the contact number of the parent/guardian.
     *
     * @param contactNumber Contact number to set
     */
    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    /**
     * Gets the email address of the parent/guardian.
     *
     * @return email
     */
    public String getEmail() {
        return email;
    }

    /**
     * Sets the email address of the parent/guardian.
     *
     * @param email Email to set
     */
    public void setEmail(String email) {
        this.email = email;
    }
}
