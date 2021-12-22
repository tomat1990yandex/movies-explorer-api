require('dotenv').config();

const JWT_SECRET_KEY = 'dev-secret';

const {
  PORT = 3000,
  NODE_ENV = 'production',
  JWT_SECRET = JWT_SECRET_KEY,
  MONGO_URL = 'mongodb://localhost:27017/moviesdb',
} = process.env;

const cookieConfig = {
  maxAge: 3600000,
  httpOnly: true,
  sameSite: true,
};

module.exports = {
  JWT_SECRET_KEY,
  PORT,
  NODE_ENV,
  JWT_SECRET,
  MONGO_URL,
  cookieConfig,
};
