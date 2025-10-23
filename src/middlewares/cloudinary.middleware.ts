import { v2 as cloudinary } from 'cloudinary'
import streamifier from 'streamifier'
import { env } from '../config'
import { NextFunction, Request, Response } from 'express'

cloudinary.config({
  cloud_name: env.cloudinary.cloud_name,
  api_key: env.cloudinary.api_key,
  api_secret: env.cloudinary.api_secret
})

const uploadImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.files || !(req.files as Express.Multer.File[]).length) {
      return next()
    }

    const files = req.files as Express.Multer.File[]

    const uploadBuffer = (buffer: Buffer): Promise<any> => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: 'books' }, (error, result) => {
          if (error) reject(error)
          else resolve(result)
        })
        streamifier.createReadStream(buffer).pipe(stream)
      })
    }

    const results = await Promise.all(files.map((file) => uploadBuffer(file.buffer)))

    req.body.images = results.map((r) => (r as any).secure_url)

    next()
  } catch (err) {
    next(err)
  }
}

export default { uploadImages }
