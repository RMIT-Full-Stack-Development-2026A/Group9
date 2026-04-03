import { getCurrentUserContext } from "./user.service.js";

export async function meController(req, res) {
	const result = await getCurrentUserContext(req.auth?.userId);

	if (!result.ok) {
		return res.status(result.status).json({ message: result.message });
	}

	return res.status(result.status).json(result.data);
}
