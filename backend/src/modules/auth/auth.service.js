import jwt from "jsonwebtoken";
import * as authRepository from "./auth.repository.js";
import { toAuthDTO } from "../users/user.dto.js";
import { validateRegistration, validateEmail, validateUsername } from "../../shared/utils/validators.js";
import * as loginAttemptService from "../../shared/security/loginAttemptService.js";
import * as tokenBlacklistService from "../../shared/security/tokenBlacklistService.js";
import { AppError } from "../../shared/errors/AppError.js";

export const register = async ({ username, email, password, confirmPassword, country }) => {
  // Backend validation (Req 1.3.1)
  const validation = validateRegistration({ username, email, password, confirmPassword, country });
  if (!validation.valid) {
    const firstError = Object.values(validation.errors)[0];
    const error = new AppError(firstError, 400, "VALIDATION_ERROR");
    error.validationErrors = validation.errors;
    throw error;
  }

  // Unique email check (Req 1.1.2)
  const existingEmail = await authRepository.findByEmail(email);
  if (existingEmail) {
    throw new AppError(
      "Email already registered. Please use a different email address or sign in to your existing account.",
      409,
      "EMAIL_EXISTS"
    );
  }

  // Unique username check
  const existingUsername = await authRepository.findByUsername(username);
  if (existingUsername) {
    throw new AppError(
      "Username already taken. Please choose a different username (e.g., Player_01, Cool-Gamer).",
      409,
      "USERNAME_EXISTS"
    );
  }

  // Password is hashed automatically by the pre-save hook (Req 1.1.3)
  const user = await authRepository.createUser({
    username,
    email,
    password,
    country,
  });

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { token, user: toAuthDTO(user) };
};

export const login = async ({ identifier, password }) => {
  // identifier can be email or username (Req 2.1.1)
  if (!identifier || !password) {
    throw new AppError(
      "Username/email and password are required.",
      400,
      "MISSING_CREDENTIALS"
    );
  }

  // Brute-force protection (Req 2.2.1)
  if (loginAttemptService.isBlocked(identifier)) {
    const remaining = loginAttemptService.getRemainingLockTime(identifier);
    throw new AppError(
      `Account temporarily locked due to too many failed login attempts. Please try again in ${remaining} seconds.`,
      429,
      "ACCOUNT_LOCKED"
    );
  }

  const user = await authRepository.findByEmailOrUsername(identifier);
  if (!user) {
    loginAttemptService.recordFailedAttempt(identifier);
    throw new AppError("Invalid credentials. Please check your username/email and password.", 401, "INVALID_CREDENTIALS");
  }

  // Check if account is deactivated (Req 6.2.1)
  if (!user.isActive) {
    throw new AppError(
      "Your account has been deactivated by an administrator. Please contact support.",
      403,
      "ACCOUNT_DEACTIVATED"
    );
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    loginAttemptService.recordFailedAttempt(identifier);
    throw new AppError("Invalid credentials. Please check your username/email and password.", 401, "INVALID_CREDENTIALS");
  }

  // Successful login — clear attempts
  loginAttemptService.clearAttempts(identifier);

  // JWT with user identity (Req 2.3.1)
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { token, user: toAuthDTO(user) };
};

export const logout = (token) => {
  // Invalidate / revoke token (Req 2.3.2)
  tokenBlacklistService.blacklistToken(token);
};
