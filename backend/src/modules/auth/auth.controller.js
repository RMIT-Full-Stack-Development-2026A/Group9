import * as authService from "./auth.service.js";
import { toRegisterResponseDTO, toLoginResponseDTO } from "./auth.dto.js";

export const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(toRegisterResponseDTO(result.token, result.user));
  } catch (error) {
    const status = error.statusCode || 500;
    const response = { message: error.message };
    if (error.validationErrors) {
      response.errors = error.validationErrors;
    }
    res.status(status).json(response);
  }
};

export const login = async (req, res) => {
  try {
    // Support both { identifier, password } and legacy { email, password }
    const { identifier, email, password } = req.body;
    const result = await authService.login({
      identifier: identifier || email,
      password,
    });
    res.json(toLoginResponseDTO(result.token, result.user));
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ message: error.message, errorCode: error.errorCode });
  }
};

export const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      authService.logout(token);
    }
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
