/**
 * ============================================================================
 * APP ERROR FILE PURPOSE
 * ============================================================================
 * Purpose: Shared operational error class used across modules and middlewares
 * so API error responses are consistent and predictable.
 *
 * Note: Keep this implementation stable because many modules depend on it.
 */

class AppError extends Error {
	constructor(message, statusCode = 500, details = null) {
		super(message);

		this.name = "AppError";
		this.statusCode = statusCode;
		this.status = String(statusCode).startsWith("4") ? "fail" : "error";
		this.isOperational = true;

		if (details) {
			this.details = details;
		}

		Error.captureStackTrace(this, this.constructor);
	}
}

export default AppError;