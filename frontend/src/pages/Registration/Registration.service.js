import http from "../../utils/http.helper.js";
import { AUTH_ROUTES } from "../../config/api.config.js";

export const register = (data) => http.post(AUTH_ROUTES.REGISTER, data);