export const toProfileDTO = (user) => {
  const obj = user.toObject ? user.toObject() : user;
  return {
    _id: obj._id,
    username: obj.username,
    email: obj.email,
    country: obj.country,
    role: obj.role,
    avatar: obj.avatar,
    isPremium: obj.isPremium,
    createdAt: obj.createdAt,
  };
};

export const toAuthDTO = (user) => {
  const obj = user.toObject ? user.toObject() : user;
  return {
    _id: obj._id,
    username: obj.username,
    email: obj.email,
    country: obj.country,
    avatar: obj.avatar,
    role: obj.role,
    isPremium: obj.isPremium,
  };
};

export const toPublicDTO = (user) => {
  const obj = user.toObject ? user.toObject() : user;
  return {
    _id: obj._id,
    username: obj.username,
    country: obj.country,
    avatar: obj.avatar,
  };
};
