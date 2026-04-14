import http from "../../utils/http.helper.js";

export const login = (data) => http.post("/auth/login", data);
