import Joi from 'joi'
import customValidate from './custom.validate'

const addCategory = {
  body: Joi.object({
    title: Joi.string().trim().min(2).max(100).required().messages({
      'string.empty': 'Tên danh mục không được để trống.',
      'string.min': 'Tên danh mục phải có ít nhất 2 ký tự.',
      'string.max': 'Tên danh mục tối đa 100 ký tự.',
      'any.required': 'Vui lòng nhập tên danh mục.'
    }),

    parentId: Joi.allow(null, '').optional().custom(customValidate.objectId).messages({
      'any.invalid': 'ID sản phẩm không hợp lệ.'
    })
  })
}

const editCategory = {
  body: Joi.object({
    title: Joi.string().trim().min(2).max(100).optional().messages({
      'string.min': 'Tên danh mục phải có ít nhất 2 ký tự.',
      'string.max': 'Tên danh mục tối đa 100 ký tự.'
    }),

    parentId: Joi.allow(null, '').optional().custom(customValidate.objectId).messages({
      'any.invalid': 'ID sản phẩm không hợp lệ.'
    })
  })
}

const checkCategoryId = {
  params: Joi.object({
    categoryId: Joi.string().custom(customValidate.objectId).required().messages({
      'any.invalid': 'ID danh mục không hợp lệ.',
      'any.required': 'Thiếu ID danh mục.'
    })
  })
}
export default {
  addCategory,
  editCategory,
  checkCategoryId
}
