import { CustomHelpers } from 'joi'

const objectId = (value: string, helpers: CustomHelpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.error('Định dạng ID không hợp lệ.')
  }

  return value
}

export default {
  objectId
}
