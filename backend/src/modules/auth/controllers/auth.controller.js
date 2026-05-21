import { register as registerAuth, login as loginAuth, getMyProfile, logout as logoutAuth } from "../services/auth.service.js";

// Extract raw Bearer token from `Authorization` header. Returns `null` when missing.
const getBearerToken = (authorizationHeader = "") => {
	if (!authorizationHeader.startsWith("Bearer ")) return null;
	return authorizationHeader.slice(7).trim();
};

// Build a small session context used for session auditing (user agent and IP)
const extractSessionContext = (req) => ({
	userAgent: req.headers["user-agent"],
	ipAddress: req.ip,
});

// Normalize user object to a safe response shape returned to clients
const userIdentity = (u) => ({
	id: u._id || u.id,
	username: u.username,
	email: u.email,
	role: u.role,
	premiumUntil: u.premiumUntil || null,
	avatar: u.avatar || "",
	country: u.country,
	walletBalance: u.walletBalance,
});

// Register endpoint: delegates validation, creation and session creation to service
export const register = async (req, res, next) => {
	try {
		const { accessToken, user } = await registerAuth(req.body, req.file, extractSessionContext(req));
		return res.status(201).json({ success: true, data: { accessToken, user: userIdentity(user) } });
	} catch (error) {
		return next(error);
	}
};

// Login endpoint: validates credentials and returns access token + user
export const login = async (req, res, next) => {
	try {
		const { accessToken, user } = await loginAuth(req.body, extractSessionContext(req));
		return res.status(200).json({ success: true, data: { accessToken, user: userIdentity(user) } });
	} catch (error) {
		return next(error);
	}
};

// Get current user's profile. `req.user` is expected to come from auth middleware.
export const me = async (req, res, next) => {
	try {
		const profile = await getMyProfile(req.user.id);
		return res.status(200).json({ success: true, data: userIdentity(profile) });
	} catch (error) {
		return next(error);
	}
};

// Logout: takes Authorization header token, revokes server session and blacklists token expiry
export const logout = async (req, res, next) => {
	try {
		const token = getBearerToken(req.headers.authorization || "");
		const result = await logoutAuth(token);
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		return next(error);
	}
};
