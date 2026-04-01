import http from "../../utils/http.helper.js";
import { AUTH_ROUTES } from "../../config/api.config.js";

export const login = (data) => http.post(AUTH_ROUTES.LOGIN, data);
