require('dotenv').config();

const { JWT_SECRET, PORT, MONGODB_URI, MAILER_MAIL, MAILER_PASS } = process.env;

module.exports = {
  JWT_SECRET: JWT_SECRET || 'local_JWT_Secret_test123',
  PORT: parseInt(PORT, 10) || 3000,
  MONGODB_URI: MONGODB_URI || 'mongodb://localhost:27017/news_db',
  MAILER_MAIL,
  MAILER_PASS,

  apiKey: '7172a2f0b71e4f8dbb5a3707f0f89742',
  baseUrl: 'https://newsapi.org/v2',
};
