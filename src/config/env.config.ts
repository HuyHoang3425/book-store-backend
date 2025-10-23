import dotenv from 'dotenv'
dotenv.config()

const env = {
  server: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000
  },
  db: {
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/book-store'
  },
  bcrypt: {
    saltRounds: parseInt(process.env.SALT_ROUNDS || '10', 10)
  },
  jwt: {
    accessToken: process.env.JWT_ACCESS_SECRET,
    refreshToken: process.env.JWT_REFRESH_SECRET,
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRESIN,
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRESIN
  },
  register: {
    adminsMail: ['buihoang3425@gmail.com']
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  }
}

export default env
