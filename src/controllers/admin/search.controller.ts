import { Request, Response } from 'express'
import { ApiError, catchAsync, response } from '../../utils'
import slugify from 'slugify'
import { productModel } from '../../models'
import { StatusCodes } from 'http-status-codes'
import { title } from 'node:process'

const modelMap: Record<string, any> = {
  product: productModel
}

const search = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { resource } = req.params as any
  const { keyword } = req.query as any

  const model = modelMap[resource]
  if (!model) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'resource không hợp lệ.')
  }
  let results: any[] = []
  if (keyword) {
    const formatKeyword = slugify(keyword, {
      replacement: '-',
      lower: false,
      locale: 'vi',
      trim: true
    })
    const regexKeyword = new RegExp(formatKeyword, 'i')
    const regex = new RegExp(keyword, 'i')
    results = await model.find({
      $or: [
        {
          slug: regexKeyword
        },
        {
          title: regex
        },
        {
          authors: regex
        },
        {
          publisher: regex
        }
      ]
    })
  }
  res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Tìm kiếm sản phẩm thành công.', { results }))
})
export default {
  search
}
