import User from "../users/user.model.js";

export const findByEmail = (email) => User.findOne({ email });

export const findByUsername = (username) => User.findOne({ username });

export const findByEmailOrUsername = (identifier) =>
  User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });

export const createUser = (userData) => User.create(userData);
