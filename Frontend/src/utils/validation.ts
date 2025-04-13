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
