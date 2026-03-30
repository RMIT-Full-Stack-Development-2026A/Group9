import User from "../users/user.model.js";

export const findByEmail = (email) => User.findOne({ email });

export const createUser = (userData) => User.create(userData);
