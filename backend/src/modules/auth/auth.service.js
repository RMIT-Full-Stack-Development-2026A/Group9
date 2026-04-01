import jwt from "jsonwebtoken";
import * as authRepository from "./auth.repository.js";
import { toAuthDTO } from "../users/user.dto.js";

export const register = async ({ username, email, password, country }) => {
  const existing = await authRepository.findByEmail(email);
  if (existing) throw new Error("Email already registered");

  const user = await authRepository.createUser({
    username,
    email,
    password,
    country,
  });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return { token, user: toAuthDTO(user) };
};

export const login = async ({ email, password }) => {
  const user = await authRepository.findByEmail(email);
  if (!user) throw new Error("Invalid email or password");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Invalid email or password");

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return { token, user: toAuthDTO(user) };
};
