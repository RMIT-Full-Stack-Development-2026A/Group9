import authService from "../services/auth.service.js";
import { VALIDATION_RULES } from "../../utils/validation.js";

class AuthController {
  async login(req, res) {
    try {
      const { identifier, password } = req.body;

      if (!identifier || !password) {
        return res.status(400).json({ 
          message: "Identifier and password are required.",
          example: "Valid input: { 'identifier': 'player_1', 'password': 'Password123!' }"
        });
      }

      const result = await authService.login(identifier, password);
      
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({ 
        message: error.message,
        cause: "Authentication failed",
        example: "Ensure your username/email and password are correct." 
      });
    }
  }
}

export default new AuthController();