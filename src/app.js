const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const config = require('./config');

const { router: postsRouter } = require('./routes/posts');
const { router: userRouter } = require('./routes/user');
const errorMiddleware = require('./middlewares/error-middleware');

async function setup() {
  const app = express();

  try {
    await mongoose.connect(config.mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }

  app.use(helmet());
  app.use(compression());
  app.use(morgan('dev'));
  app.use(cors({
    credentials: true,
    origin: config.clientUrl,
  }));
  app.use(cookieParser());

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit in ms
    message: 'Too many requests from this IP, please try again later.',
  });
  app.use(limiter);

  app.use(express.static(path.join(__dirname, 'public')));

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'welcome.html'));
  });

  app.use(express.json());

  app.use('/post', postsRouter);
  app.use('/user', userRouter);

  app.use(errorMiddleware);

  process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    mongoose.connection.close(() => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });

  return app;
}

module.exports = setup;
