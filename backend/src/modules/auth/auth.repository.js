import User from "../users/user.model.js";

class AuthRepository {
  async findByEmailOrUsername(identifier) {
    return await User.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });
  }

  async updateLoginAttempts(userId, update) {
    return await User.findByIdAndUpdate(userId, update);
  }
}

export default new AuthRepository();