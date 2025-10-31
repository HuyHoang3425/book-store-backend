import mongoose, { Schema, model, Types, VirtualType } from 'mongoose'
import slug from 'mongoose-slug-updater'

mongoose.plugin(slug)

export interface ICategory {
  title: string
  slug: string
  parentId?: Types.ObjectId | null
  status: boolean
  deleted: boolean
  deletedAt: Date
}

const categorySchema = new Schema<ICategory>(
  {
    title: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      slug: 'title',
      unique: true
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null
    },
    status: {
      type: Boolean,
      default: true
    },
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  {
    timestamps: true
  }
)

export default model<ICategory>('Category', categorySchema)
