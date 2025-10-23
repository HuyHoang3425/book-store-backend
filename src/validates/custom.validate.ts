import { CustomHelpers } from 'joi'
import mongoose from 'mongoose'

const objectId = (value: string, helpers: CustomHelpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid')
  }
  return value
}

export default {
  objectId
}
