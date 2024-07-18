const jwt = require('jsonwebtoken');
const util = require('util');
const User = require('../models/User');
const { JWT_SECRET } = require('../config');

const { isTokenRevoked } = require('../utils/revokedTokens');

const verifyAsync = util.promisify(jwt.verify);

const authenticateUser = async (req, res, next) => {
  try {
    const { authorization: token } = req.headers;

    if (!token) {
      return res.status(401).json({ error: 'UN_Authenticated' });
    }

    const decodedToken = await verifyAsync(token, JWT_SECRET);

    const user = await User.findById(decodedToken.id).exec();

    const tokenRevoked = await isTokenRevoked(token);
    if (tokenRevoked) {
      return res.status(403).json({ error: 'Forbidden: Token revoked' });
    }

    if (!user) {
      return res.status(401).json({ error: "Token's user not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Expired token' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  authenticateUser,
};
