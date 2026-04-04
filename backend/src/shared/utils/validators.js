/**
 * Shared validation utilities used by both auth and other modules.
 * Each validator returns { valid: boolean, message: string }.
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
        "Email address is too long. The total length must be less than 255 characters (e.g., user@example.com).",
    };
  }

  if (email.includes(" ")) {
    return {
      valid: false,
      message:
        "Email address must not contain spaces. Please remove any spaces (e.g., user@example.com).",
    };
  }

  const prohibited = /[();<>:]/;
  if (prohibited.test(email)) {
    return {
      valid: false,
      message:
        'Email contains prohibited characters. Avoid ( ) ; : < > characters (e.g., user@example.com).',
    };
  }

  const atCount = (email.match(/@/g) || []).length;
  if (atCount !== 1) {
    return {
      valid: false,
      message:
        "Email must contain exactly one '@' symbol (e.g., user@example.com).",
    };
  }

  const [, domain] = email.split("@");
  if (!domain || !domain.includes(".")) {
    return {
      valid: false,
      message:
        "Email must contain at least one '.' after the '@' symbol (e.g., user@example.com).",
    };
  }

  return { valid: true, message: "" };
};

export const validatePassword = (password) => {
  if (!password || typeof password !== "string") {
    return {
      valid: false,
      message:
        "Password is required. It must be at least 8 characters with 1 number, 1 special character, and 1 uppercase letter (e.g., MyPass1!).",
    };
  }

  const errors = [];

  if (password.length < 8) {
    errors.push("at least 8 characters");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("at least 1 number (0-9)");
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) {
    errors.push("at least 1 special character (e.g., $#@!)");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("at least 1 uppercase letter (A-Z)");
  }

  if (errors.length > 0) {
    return {
      valid: false,
      message: `Password must contain ${errors.join(", ")}. Example of a valid password: MyPass1!`,
    };
  }

  return { valid: true, message: "" };
};

export const validateUsername = (username) => {
  if (!username || typeof username !== "string") {
    return {
      valid: false,
      message:
        "Username is required. It must contain only English letters, numbers, underscores, or hyphens (e.g., Player_01 or Cool-Gamer).",
    };
  }

  if (!/^[A-Za-z0-9_-]+$/.test(username)) {
    return {
      valid: false,
      message:
        "Username contains invalid characters. Only English alphabets (A-Z, a-z), numbers (0-9), underscore (_), and hyphen (-) are allowed (e.g., Player_01, Cool-Gamer).",
    };
  }

  return { valid: true, message: "" };
};

export const validateCountry = (country) => {
  if (!country || typeof country !== "string" || !country.trim()) {
    return {
      valid: false,
      message:
        "Country is required. Please select a country from the dropdown list.",
    };
  }
  return { valid: true, message: "" };
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return { valid: false, message: "Passwords do not match." };
  }
  return { valid: true, message: "" };
};

export const validateRegistration = (data) => {
  const errors = {};

  const usernameCheck = validateUsername(data.username);
  if (!usernameCheck.valid) errors.username = usernameCheck.message;

  const emailCheck = validateEmail(data.email);
  if (!emailCheck.valid) errors.email = emailCheck.message;

  const passwordCheck = validatePassword(data.password);
  if (!passwordCheck.valid) errors.password = passwordCheck.message;

  const confirmCheck = validateConfirmPassword(
    data.password,
    data.confirmPassword
  );
  if (!confirmCheck.valid) errors.confirmPassword = confirmCheck.message;

  const countryCheck = validateCountry(data.country);
  if (!countryCheck.valid) errors.country = countryCheck.message;

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
