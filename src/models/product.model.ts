import { Schema, model ,Types } from 'mongoose'

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
    language: { type: String, default: 'vi' },
    ISBN: { type: String },
    size: { type: String },
    page: { type: Number, min: 0 },
    format: { type: String },
    quantity: { type: Number, default: 0 },
    price: { type: Number, required: true },
    weight: { type: String },
    sold: { type: Number, default: 0 },
    status: { type: String, enum: ['available', 'out-of-stock', 'discontinued'], default: 'available' },
    deleted:{
      type:Boolean,
      default:false
    },
    deletedAt:Date,
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
