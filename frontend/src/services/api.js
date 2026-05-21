import { httpHelper } from "../shared/utils/http.helper";

/*
	api
	- A minimal, documented thin wrapper around the project's centralized
		`httpHelper` (axios instance). The goal of this layer is to provide a
		concise and discoverable interface for making HTTP calls from UI
		modules while keeping the low-level configuration (base URL,
		auth token injection, global error handling) inside `httpHelper`.

	- Method signatures mirror axios-style calls accepted by `httpHelper`.
		Each method forwards arguments directly and returns the resulting
		promise so callers can `await` or chain `.then()`/.catch().

	- Notes about `options`:
		- `options` is forwarded to axios and may include query params,
			headers, signal (AbortController), etc.
		- Authentication is handled at the `httpHelper` level by reading the
			token from localStorage and setting the `Authorization` header.

	- Examples:
		- GET list: `const { data } = await api.get('/users');`
		- POST body: `const { data } = await api.post('/profile', { username });`
		- With options: `await api.get('/games', { params: { page: 2 } });`
*/
export const api = {
	/** GET / read
	 * @param {string} path - API path (relative to configured base URL)
	 * @param {object} [options] - axios request config (params, headers, signal)
	 */
	get: (path, options) => httpHelper.get(path, options),

	/** POST / create
	 * @param {string} path
	 * @param {object} data - request body
	 * @param {object} [options]
	 */
	post: (path, data, options) => httpHelper.post(path, data, options),

	/** PUT / replace
	 * @param {string} path
	 * @param {object} data - request body
	 * @param {object} [options]
	 */
	put: (path, data, options) => httpHelper.put(path, data, options),

	/** PATCH / partial update
	 * @param {string} path
	 * @param {object} data - request body
	 * @param {object} [options]
	 */
	patch: (path, data, options) => httpHelper.patch(path, data, options),

	/** DELETE
	 * @param {string} path
	 * @param {object} [options]
	 */
	del: (path, options) => httpHelper.del(path, options),
};
