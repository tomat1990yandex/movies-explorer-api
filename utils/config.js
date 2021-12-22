require('dotenv').config();

const SECRET_KEY_DEV = 'secret-key';

const {
  PORT = 3000,
  NODE_ENV = 'development',
  JWT_SECRET = SECRET_KEY_DEV,
  MONGO_URL = 'mongodb://localhost:27017/moviesdb',
} = process.env;

// const cookieConfig = {
//   maxAge: 3600000,
//   httpOnly: true,
//   // sameSite: true,
// };

module.exports = {
  SECRET_KEY_DEV,
  PORT,
  NODE_ENV,
  JWT_SECRET,
  MONGO_URL,
  // cookieConfig,
};
