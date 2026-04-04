/**
 * Frontend validation — mirrors backend validators for instant feedback (Req 1.3.1).
 * Each returns { valid, message }.
 */

export const validateEmail = (email) => {
  if (!email || typeof email !== "string") {
    return {
      valid: false,
      message:
        "Email is required. Please provide a valid email address (e.g., user@example.com).",
    };
  }
  if (email.length >= 255) {
    return {
      valid: false,
      message:
        "Email address is too long. Must be less than 255 characters (e.g., user@example.com).",
    };
  }
  if (email.includes(" ")) {
    return {
      valid: false,
      message:
        "Email must not contain spaces (e.g., user@example.com).",
    };
  }
  const prohibited = /[();<>:]/;
  if (prohibited.test(email)) {
    return {
      valid: false,
      message:
        'Email contains prohibited characters. Avoid ( ) ; : < > (e.g., user@example.com).',
    };
  }
  const atCount = (email.match(/@/g) || []).length;
  if (atCount !== 1) {
    return {
      valid: false,
      message: "Email must contain exactly one '@' symbol (e.g., user@example.com).",
    };
  }
  const [, domain] = email.split("@");
  if (!domain || !domain.includes(".")) {
    return {
      valid: false,
      message:
        "Email must contain at least one '.' after '@' (e.g., user@example.com).",
    };
  }
  return { valid: true, message: "" };
};

export const validatePassword = (password) => {
  if (!password) {
    return {
      valid: false,
      message: "Password is required (e.g., MyPass1!).",
    };
  }
  const errors = [];
  if (password.length < 8) errors.push("at least 8 characters");
  if (!/[0-9]/.test(password)) errors.push("at least 1 number (0-9)");
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password))
    errors.push("at least 1 special character (e.g., $#@!)");
  if (!/[A-Z]/.test(password)) errors.push("at least 1 uppercase letter (A-Z)");
  if (errors.length > 0) {
    return {
      valid: false,
      message: `Password must contain ${errors.join(", ")}. Example: MyPass1!`,
    };
  }
  return { valid: true, message: "" };
};

export const validateUsername = (username) => {
  if (!username) {
    return {
      valid: false,
      message:
        "Username is required. Use letters, numbers, _ or - (e.g., Player_01).",
    };
  }
  if (!/^[A-Za-z0-9_-]+$/.test(username)) {
    return {
      valid: false,
      message:
        "Only English letters, numbers, underscore (_), and hyphen (-) allowed (e.g., Player_01, Cool-Gamer).",
    };
  }
  return { valid: true, message: "" };
};

export const validateCountry = (country) => {
  if (!country || !country.trim()) {
    return { valid: false, message: "Please select a country from the list." };
  }
  return { valid: true, message: "" };
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return { valid: false, message: "Passwords do not match." };
  }
  return { valid: true, message: "" };
};

export const validateRegistrationForm = (data) => {
  const errors = {};
  const u = validateUsername(data.username);
  if (!u.valid) errors.username = u.message;
  const e = validateEmail(data.email);
  if (!e.valid) errors.email = e.message;
  const p = validatePassword(data.password);
  if (!p.valid) errors.password = p.message;
  const c = validateConfirmPassword(data.password, data.confirmPassword);
  if (!c.valid) errors.confirmPassword = c.message;
  const co = validateCountry(data.country);
  if (!co.valid) errors.country = co.message;
  return { valid: Object.keys(errors).length === 0, errors };
};
