// Validate email
export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required";
  if (!emailRegex.test(email)) return "Invalid email address";
  return null; // valid
};

// Validate password
export const validatePassword = (password: string): string | null => {
  // Simplified regex: at least 6 characters, must include a letter and a number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
  if (!password) return "Password is required";
  if (!passwordRegex.test(password))
    return "Password must be at least 6 characters long and include letters and numbers";
  return null; // valid
};
