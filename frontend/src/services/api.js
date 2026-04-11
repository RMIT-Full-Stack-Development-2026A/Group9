import { httpHelper } from "../shared/utils/http.helper";

export const api = {
	get: (path, options) => httpHelper.get(path, options),
	post: (path, data, options) => httpHelper.post(path, data, options),
	put: (path, data, options) => httpHelper.put(path, data, options),
	patch: (path, data, options) => httpHelper.patch(path, data, options),
	del: (path, options) => httpHelper.del(path, options),
};
