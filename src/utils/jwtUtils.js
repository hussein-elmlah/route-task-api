const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const generateToken = (user) => jwt.sign({ fullname: user.fullname, id: user._id }, JWT_SECRET, { expiresIn: '7d' });

module.exports = generateToken;
