import { Schema, model, Types } from 'mongoose'

export interface IToken {
  userId: Types.ObjectId
  refreshToken: string
  expireAt: Date
}

const tokenSchema = new Schema<IToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    refreshToken: {
      type: String,
      required: true
    },
    expireAt: {
      type: Date,
      expires: 60 * 60 * 24 * 15
    }
  },
  {
    timestamps: true
  }
)

export default model<IToken>('Token', tokenSchema)
