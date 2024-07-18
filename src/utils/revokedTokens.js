const RevokedToken = require('../models/RevokedToken');

const isTokenRevoked = async (token) => {
  const result = await RevokedToken.exists({ token });
  return result;
};

const revokeToken = async (token) => {
  const revokedToken = new RevokedToken({ token });
  await revokedToken.save();
};

module.exports = {
  isTokenRevoked,
  revokeToken,
};
