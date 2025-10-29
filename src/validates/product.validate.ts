import Joi from 'joi'
import customValidate from './custom.validate'
import { productConstant } from '../constants'

const createProduct = {
  body: Joi.object({
    title: Joi.string().trim().required().messages({
      'string.empty': 'Title không được để trống',
      'any.required': 'Title là bắt buộc'
    }),
    description: Joi.string().trim().optional().allow('', null),
    authors: Joi.array().items(Joi.string().trim()).single().min(1).required().messages({
      'array.base': 'Authors phải là mảng',
      'array.min': 'Phải có ít nhất 1 tác giả',
      'any.required': 'Authors là bắt buộc'
    }),
    publisher: Joi.string().trim().required().messages({
      'string.empty': 'Publisher không được để trống',
      'any.required': 'Publisher là bắt buộc'
    }),
    publishingYear: Joi.number()
      .integer()
      .min(1900)
      .max(new Date().getFullYear())
      .required()
      .messages({
        'number.base': 'Publishing year phải là số',
        'number.min': 'Publishing year không được nhỏ hơn 1900',
        'number.max': `Publishing year không được lớn hơn ${new Date().getFullYear()}`,
        'any.required': 'Publishing year là bắt buộc'
      }),
    // categoryId: Joi.string().required().messages({
    //   'string.empty': 'CategoryId không được để trống',
    //   'any.required': 'CategoryId là bắt buộc'
    // }),
    language: Joi.string().trim().optional(),
    ISBN: Joi.string().optional(),
    size: Joi.string().optional(),
    page: Joi.number().integer().optional().messages({
      'number.base': 'Page phải là số'
    }),
    format: Joi.string().optional(),
    quantity: Joi.number().integer().min(0).required().messages({
      'number.base': 'Quantity phải là số',
      'number.min': 'Quantity không được âm',
      'any.required': 'Quantity là bắt buộc'
    }),
    price: Joi.number().min(0).required().messages({
      'number.base': 'Price phải là số',
      'number.min': 'Price không được âm',
      'any.required': 'Price là bắt buộc'
    }),
    weight: Joi.string().optional(),
    images: Joi.array().items(Joi.string().uri()).min(1).required().messages({
      'array.base': 'Images phải là một mảng',
      'array.min': 'Phải có ít nhất 1 hình ảnh',
      'any.required': 'Images là bắt buộc'
    })
  })
}

const editProduct = {
  body: Joi.object({
    title: Joi.string().trim().optional().messages({
      'string.empty': 'Title không được để trống'
    }),

    description: Joi.string().trim().optional().allow('', null),

    authors: Joi.array().items(Joi.string().trim()).single().optional().messages({
      'array.base': 'Authors phải là mảng',
      'array.min': 'Phải có ít nhất 1 tác giả'
    }),

    publisher: Joi.string().trim().optional().messages({
      'string.empty': 'Publisher không được để trống'
    }),

    publishingYear: Joi.number()
      .integer()
      .min(1900)
      .max(new Date().getFullYear())
      .optional()
      .messages({
        'number.base': 'Publishing year phải là số',
        'number.min': 'Publishing year không được nhỏ hơn 1900',
        'number.max': `Publishing year không được lớn hơn ${new Date().getFullYear()}`
      }),

    language: Joi.string().trim().optional(),

    ISBN: Joi.string().optional(),

    size: Joi.string().optional(),

    page: Joi.number().integer().optional().messages({
      'number.base': 'Page phải là số'
    }),

    format: Joi.string().optional(),

    quantity: Joi.number().integer().min(0).optional().messages({
      'number.base': 'Quantity phải là số',
      'number.min': 'Quantity không được âm'
    }),

    price: Joi.number().min(0).optional().messages({
      'number.base': 'Price phải là số',
      'number.min': 'Price không được âm'
    }),

    weight: Joi.string().optional(),

    images: Joi.array().items(Joi.string().uri()).optional().messages({
      'array.base': 'Images phải là một mảng'
    })
  }),
  params: Joi.object({
    productId: Joi.string().custom(customValidate.objectId).required().messages({
      'any.invalid': 'ID sản phẩm không hợp lệ.',
      'any.required': 'Thiếu ID sản phẩm.'
    })
  })
}

const checkId = {
  params: Joi.object({
    productId: Joi.string().custom(customValidate.objectId).required().messages({
      'any.invalid': 'ID sản phẩm không hợp lệ.',
      'any.required': 'Thiếu ID sản phẩm.'
    })
  })
}

const action = {
  body: Joi.object({
    ids: Joi.array()
      .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
      .min(1)
      .required()
      .messages({
        'array.base': 'ids phải là một mảng',
        'array.min': 'Phải chọn ít nhất 1 sản phẩm',
        'any.required': 'Thiếu danh sách ids',
        'string.pattern.base': 'Mỗi id phải là ObjectId hợp lệ'
      }),
    action: Joi.string()
      .valid(
        productConstant.ACTION.DELETEALL,
        productConstant.STATUS.AVAILABLE,
        productConstant.STATUS.OUT_OF_STOCK,
        productConstant.STATUS.DISCONTINUED
      )
      .required()
      .messages({
        'any.only': 'Giá trị action không hợp lệ',
        'any.required': 'Thiếu trường action'
      })
  })
}

export default {
  createProduct,
  editProduct,
  checkId,
  action
}
