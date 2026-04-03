import { loginUser, logoutUser } from "../auth.service.js";

export async function loginController(req, res) {
	const result = await loginUser({
		identity: req.body?.identity,
		password: req.body?.password,
	});

	if (!result.ok) {
		return res.status(result.status).json({ message: result.message });
	}

	return res.status(result.status).json(result.data);
}

export async function logoutController(req, res) {
	const result = await logoutUser({
		jti: req.auth?.jti,
		exp: req.auth?.exp,
	});

	return res.status(result.status).json(result.data);
}
