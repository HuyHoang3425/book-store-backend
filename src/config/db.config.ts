import mongoose from 'mongoose'
import { logger } from '../config'
import { env } from '../config'

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.db.mongoUri)
    logger.info('Connected to the database')
  } catch (error: any) {
    logger.error(`Database connection failed: ${error.message}`, { stack: error.stack })
    process.exit(1)
  }
}

export default connectDB
