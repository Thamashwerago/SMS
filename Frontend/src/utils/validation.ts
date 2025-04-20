export interface TeacherFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  joiningDate: string;
  status: string;
  role: string;
}

export function validateTeacherForm(formData: TeacherFormData): string[] {
  const errors: string[] = [];

  if (!formData.username.trim()) {
    errors.push("Username is required.");
  }
  
  if (!formData.email.trim()) {
    errors.push("Email is required.");
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
    errors.push("Invalid email address.");
  }
  
  if (!formData.password.trim()) {
    errors.push("Password is required.");
  } else if (formData.password.length < 6) {
    errors.push("Password must be at least 6 characters long.");
  }
  
  if (formData.password !== formData.confirmPassword) {
    errors.push("Passwords do not match.");
  }
  
  if (!formData.name.trim()) {
    errors.push("Name is required.");
  }
  
  if (!formData.phone.trim()) {
    errors.push("Phone is required.");
  }
  
  if (!formData.dob) {
    errors.push("Date of birth is required.");
  }
  
  if (!formData.gender.trim()) {
    errors.push("Gender is required.");
  }
  
  if (!formData.address.trim()) {
    errors.push("Address is required.");
  }
  
  if (!formData.joiningDate) {
    errors.push("Joining Date is required.");
  }
  
  if (!formData.status.trim()) {
    errors.push("Status is required.");
  } else if (!["Active", "Inactive"].includes(formData.status)) {
    errors.push("Status must be either 'Active' or 'Inactive'.");
  }
  
  return errors;
}
  
export interface StudentFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  contactNumber: string;
  nationality: string;
  role: string;
}

export function validateStudentForm(formData: StudentFormData): string[] {
  const errors: string[] = [];

  if (!formData.username.trim()) {
    errors.push("Username is required.");
  }
  if (!formData.email.trim()) {
    errors.push("Email is required.");
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
    errors.push("Invalid email address.");
  }
  if (!formData.password.trim()) {
    errors.push("Password is required.");
  } else if (formData.password.length < 6) {
    errors.push("Password must be at least 6 characters long.");
  }
  if (formData.password !== formData.confirmPassword) {
    errors.push("Passwords do not match.");
  }
  if (!formData.firstName.trim()) {
    errors.push("First name is required.");
  }
  if (!formData.lastName.trim()) {
    errors.push("Last name is required.");
  }
  if (!formData.dateOfBirth) {
    errors.push("Date of birth is required.");
  }
  if (!formData.gender.trim()) {
    errors.push("Gender is required.");
  }
  if (!formData.address.trim()) {
    errors.push("Address is required.");
  }
  if (!formData.contactNumber.trim()) {
    errors.push("Contact number is required.");
  }
  if (!formData.nationality.trim()) {
    errors.push("Nationality is required.");
  }
  return errors;
}

export interface AdminFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function validateAdminForm(formData: AdminFormData): string[] {
  const errors: string[] = [];

  if (!formData.name.trim()) {
    errors.push("Name is required.");
  }

  if (!formData.email.trim()) {
    errors.push("Email is required.");
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
    errors.push("Invalid email address.");
  }

  if (!formData.password.trim()) {
    errors.push("Password is required.");
  } else if (formData.password.length < 6) {
    errors.push("Password must be at least 6 characters long.");
  }

  if (formData.password !== formData.confirmPassword) {
    errors.push("Passwords do not match.");
  }

  return errors;
}

/**
 * ProfileFormData
 * ----------------
 * Defines the structure for the profile edit form data.
 */
export interface ProfileFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * validateProfileForm
 * --------------------
 * Validates the profile edit form, ensuring:
 * - username is non-empty
 * - email has a simple valid format
 * - if password is provided, it and confirmPassword match and meet length requirements
 *
 * @param data - The form data to validate
 * @returns An array of error messages (empty if valid)
 */
export function validateProfileForm(data: ProfileFormData): string[] {
  const errors: string[] = [];

  // Username validation
  if (!data.username.trim()) {
    errors.push("Username is required.");
  }

  // Email validation (simple regex)
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!data.email.trim()) {
    errors.push("Email is required.");
  } else if (!emailRegex.test(data.email)) {
    errors.push("Email format is invalid.");
  }

  // Password and confirmation
  if (data.password || data.confirmPassword) {
    if (data.password.length < 8) {
      errors.push("Password must be at least 8 characters.");
    }
    if (data.password !== data.confirmPassword) {
      errors.push("Password and confirmation do not match.");
    }
  }

  return errors;
}