import Joi from 'joi'

const register = {
  body: Joi.object({
    fullname: Joi.string().min(3).max(50).required().messages({
      'string.empty': 'Họ và tên không được để trống',
      'string.min': 'Họ và tên phải có ít nhất 3 ký tự',
      'string.max': 'Họ và tên không được vượt quá 50 ký tự',
      'any.required': 'Họ và tên là bắt buộc'
    }),
    email: Joi.string()
      .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      .email({ tlds: { allow: true } })
      .required()
      .messages({
        'string.empty': 'Email không được để trống',
        'string.email': 'Email không hợp lệ',
        'any.required': 'Email là bắt buộc',
        'string.pattern.base': 'Email phải đúng định dạng (vd: ten@gmail.com)'
      }),
    password: Joi.string().min(6).max(30).required().messages({
      'string.empty': 'Mật khẩu không được để trống',
      'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
      'string.max': 'Mật khẩu không được vượt quá 30 ký tự',
      'any.required': 'Mật khẩu là bắt buộc'
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
      'any.only': 'Xác nhận mật khẩu không khớp',
      'any.required': 'Xác nhận mật khẩu là bắt buộc'
    }),
    role: Joi.string().valid('user', 'admin').default('user')
  })
}

const login = {
  body: Joi.object({
    email: Joi.string()
      .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      .email({ tlds: { allow: true } })
      .required()
      .messages({
        'string.empty': 'Email không được để trống',
        'string.email': 'Email không hợp lệ',
        'any.required': 'Email là bắt buộc',
        'string.pattern.base': 'Email phải đúng định dạng (vd: ten@gmail.com)'
      }),
    password: Joi.string().min(6).max(30).required().messages({
      'string.empty': 'Mật khẩu không được để trống',
      'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
      'string.max': 'Mật khẩu không được vượt quá 30 ký tự',
      'any.required': 'Mật khẩu là bắt buộc'
    })
  })
}

export default {
  register,
  login
}
