/**
 * Auth DTOs — present only necessary data in auth responses (A.3.2).
 */

export const toLoginResponseDTO = (token, user) => {
  const obj = user.toObject ? user.toObject() : user;
  return {
    token,
    user: {
      _id: obj._id,
      username: obj.username,
      email: obj.email,
      country: obj.country,
      avatar: obj.avatar,
      role: obj.role,
      isPremium: obj.isPremium,
    },
  };
};

export const toRegisterResponseDTO = (token, user) => {
  const obj = user.toObject ? user.toObject() : user;
  return {
    token,
    user: {
      _id: obj._id,
      username: obj.username,
      email: obj.email,
      country: obj.country,
      avatar: obj.avatar,
      role: obj.role,
      isPremium: obj.isPremium,
    },
  };
};
