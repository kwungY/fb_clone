require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  host: process.env.HOST || '127.0.0.1',
  redisPort: process.env.REDIS_PORT || 6379,
  mongoUrl: process.env.MONGO_URL || "mongodb+srv://Adrian:Mongocrud2022@crud.j0ehphe.mongodb.net/fb_clone?retryWrites=true&w=majority",
  mongoDbName: process.env.MONGO_DB_NAME || "fb_clone",
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || "jwt-secret-club",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "jwt-refresh-secret-club",
  },
  smtp: {
    host: process.env.SMTP_HOST || "smtp.office365.com",
    port: process.env.SMTP_PORT || 587,
    user: process.env.SMTP_USER || "forever0754@outlook.com",
    password: process.env.SMTP_PASSWORD || "181915SMV",
  },
  apiUrl: process.env.API_URL || "http://127.0.0.1:5000",
};

module.exports = config;
