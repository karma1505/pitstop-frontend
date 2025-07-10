// Utility functions for data validation

export const isValidEmail = (email: string): boolean => {
  // More permissive email regex that allows common TLDs
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phone);
};

export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const isValidPostalCode = (postalCode: string): boolean => {
  // US ZIP code format
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(postalCode);
};

export const isEmpty = (value: string | null | undefined): boolean => {
  return !value || value.trim().length === 0;
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (isEmpty(value)) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (isEmpty(email)) {
    return 'Email is required';
  }
  if (!isValidEmail(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (isEmpty(password)) {
    return 'Password is required';
  }
  if (!isValidPassword(password)) {
    return 'Password must be at least 8 characters with uppercase, lowercase, and number';
  }
  return null;
}; 