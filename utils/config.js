require('dotenv').config();

const {
  PORT = 3000,
  NODE_ENV,
  JWT_SECRET,
  MONGO_URL = 'mongodb://localhost:27017/moviesdb',
} = process.env;

const mongoConfig = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

const cookieConfig = {
  maxAge: 3600000,
  httpOnly: true,
  sameSite: true,
};

// const corsConfig = {
//   origin: [
//     'http://localhost:3000',
//     'https://api.diminenn-me.students.nomoredomains.rocks/',
//     'https://diminenn-me.students.nomoredomains.rocks/',
//   ],
//   methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
//   preflightContinue: false,
//   optionsSuccessStatus: 204,
//   allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
//   credentials: true,
// };

module.exports = {
  PORT,
  NODE_ENV,
  JWT_SECRET,
  MONGO_URL,
  mongoConfig,
  cookieConfig,
  // corsConfig,
};
