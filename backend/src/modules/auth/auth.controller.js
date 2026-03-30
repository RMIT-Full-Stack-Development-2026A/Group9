import * as authService from "./auth.service.js";

export const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    const status = error.message === "Email already registered" ? 409 : 500;
    res.status(status).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (error) {
    const status = error.message === "Invalid email or password" ? 401 : 500;
    res.status(status).json({ message: error.message });
  }
};
