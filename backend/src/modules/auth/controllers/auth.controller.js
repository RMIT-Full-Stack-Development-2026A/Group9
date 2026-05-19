
import { register as registerAuth, login as loginAuth, getMyProfile, logout as logoutAuth } from "../interface/auth.interface.js";

const getBearerToken = (authorizationHeader = "") => {
	if (!authorizationHeader.startsWith("Bearer ")) {
		return null;
	}

	return authorizationHeader.slice(7).trim();
};

const extractSessionContext = (req) => ({
	userAgent: req.headers["user-agent"],
	ipAddress: req.ip,
});

export const register = async (req, res, next) => {
	try {
		const result = await registerAuth(req.body, req.file, extractSessionContext(req));
		return res.status(201).json({ success: true, data: result });
	} catch (error) {
		return next(error);
	}
};

export const login = async (req, res, next) => {
	try {
		const result = await loginAuth(req.body, extractSessionContext(req));
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		return next(error);
	}
};

export const me = async (req, res, next) => {
	try {
		const profile = await getMyProfile(req.user.id);
		return res.status(200).json({ success: true, data: profile });
	} catch (error) {
		return next(error);
	}
};

export const logout = async (req, res, next) => {
	try {
		const token = getBearerToken(req.headers.authorization || "");
		const result = await logoutAuth(token);
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		return next(error);
	}
};