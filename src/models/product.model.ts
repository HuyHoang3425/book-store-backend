import mongoose, { Schema, model, Types } from 'mongoose'
import slug from 'mongoose-slug-updater'

mongoose.plugin(slug)

export interface IProduct {
  title: string
  description?: string
  images: string[]
  authors: string[]
  publisher: string
  publishingYear: number
  // categoryId: string
  language: string
  ISBN?: string
  size?: string
  page?: number
  format?: string
  quantity: number
  price: number
  weight?: string
  sold: number
  status: 'available' | 'out-of-stock' | 'discontinued'
  slug: string
  deleted: boolean
  deletedAt?: Date
  ratings: { userId: Types.ObjectId; stars: number; comment?: string }[]
}

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    description: { type: String },
    images: { type: [String], default: [] },
    authors: { type: [String], required: true },
    publisher: { type: String },
    publishingYear: { type: Number },
    // categoryId: { type: String },
    language: { type: String },
    ISBN: { type: String },
    size: { type: String },
    page: { type: Number, min: 0 },
    format: { type: String },
    quantity: { type: Number, default: 0 },
    price: { type: Number, required: true },
    weight: { type: String },
    sold: { type: Number, default: 0 },
    status: { type: String, enum: ['available', 'out-of-stock', 'discontinued'], default: 'available' },
    slug: { type: String, slug: 'title', unique: true },
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date,
    ratings: [
      {
        userId: Schema.Types.ObjectId,
        stars: Number,
        comment: String
      }
    ]
  },
  {
    timestamps: true
  }
)

export default model<IProduct>('Product', productSchema)
