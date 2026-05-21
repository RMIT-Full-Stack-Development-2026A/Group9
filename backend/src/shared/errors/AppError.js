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

		// Use a consistent error shape across the app so middleware can
		// reliably format HTTP responses. `isOperational` indicates this is
		// an expected/handled error (not a programming bug) and can be shown
		// to API consumers with the provided message.
		this.name = "AppError";
		this.statusCode = statusCode;
		this.status = String(statusCode).startsWith("4") ? "fail" : "error";
		this.isOperational = true;

		// Optional structured details payload for clients (validation errors, etc.)
		if (details) {
			this.details = details;
		}

		// Capture a stack trace but omit the constructor frame for clarity
		Error.captureStackTrace(this, this.constructor);
	}
}

export default AppError;