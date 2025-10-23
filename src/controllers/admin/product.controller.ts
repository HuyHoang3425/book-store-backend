import { Request, Response } from 'express'
import { ApiError, catchAsync, response } from '../../utils'
import { productModel } from '../../models'
import { StatusCodes } from 'http-status-codes'
import { IProduct } from '../../models/product.model'

//[GET] /products
const getProducts = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { page = 1, limit = 10 } = req.query as any
  const skip = (+page - 1) * +limit
  const p = await productModel.find()
  console.log(p)
  const [products, totalProducts] = await Promise.all([
    productModel
      .find({
        status: 'available',
        deleted: false
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(+limit),
    productModel.countDocuments({ status: 'available', deleted: false })
  ])
  console.log(products)

  res.status(StatusCodes.OK).json(
    response(StatusCodes.OK, 'Lấy danh sách sản phẩm thành công', {
      products,
      page: +page,
      totalPage: Math.ceil(totalProducts / +limit),
      totalProducts,
      limit: +limit
    })
  )
})

//[POST] /products
export type CreateProductDto = Pick<
  IProduct,
  | 'title'
  | 'images'
  | 'authors'
  | 'publisher'
  | 'publishingYear'
  | 'quantity'
  | 'price'
  | 'description'
  | 'language'
  | 'ISBN'
  | 'size'
  | 'page'
  | 'format'
  | 'weight'
>
const addProduct = catchAsync(async (req: Request, res: Response) => {
  const productData = req.body as CreateProductDto
  const product = await productModel.create(productData)
  res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Tạo sản phẩm thành công.', { product }))
})

const editProduct = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params
  const productData = req.body as CreateProductDto

  const product = await productModel.findByIdAndUpdate(productId, productData, { new: true })

  if (!product) {
    return res.status(StatusCodes.NOT_FOUND).json(response(StatusCodes.NOT_FOUND, 'Không tìm thấy sản phẩm.'))
  }

  res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Sửa sản phẩm thành công.', { product }))
})

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params

  const product = await productModel.findByIdAndUpdate(productId, { deleted: true }, { new: true })

  if (!product) {
    return res.status(StatusCodes.NOT_FOUND).json(response(StatusCodes.NOT_FOUND, 'Không tìm thấy sản phẩm.'))
  }

  res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Xoá sản phẩm thành công.', { product }))
})

export default {
  getProducts,
  addProduct,
  editProduct,
  deleteProduct
}
