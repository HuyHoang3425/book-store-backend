import { Request, Response } from 'express'
import { ApiError, catchAsync, response } from '../../utils'
import { productModel, userModel } from '../../models'
import { StatusCodes } from 'http-status-codes'
import { IProduct } from '../../models/product.model'

//[GET] /products
const getProducts = catchAsync(async (req: Request, res: Response): Promise<void> => {
  //pagination
  const { page = 1, limit = 10, sortKey, sortValue, status, maxPrice, minPrice } = req.query as any
  const skip = (+page - 1) * +limit
  //end pagination

  //sort
  const sort: Record<string, string> = {}
  if (sortKey && sortValue) sort[sortKey] = sortValue
  //end sort

  // filter
  const find: Record<string, any> = {
    deleted: false
  }

  // lọc theo trạng thái
  if (status) {
    find.status = status
  }

  // lọc theo giá
  if (minPrice || maxPrice) {
    find.price = {}
    if (minPrice) find.price.$gte = +minPrice
    if (maxPrice) find.price.$lte = +maxPrice
  }
  console.log(find)
  // end filter

  const [products, totalProducts] = await Promise.all([
    productModel.find(find).sort({ createdAt: -1 }, sort).skip(skip).limit(+limit),
    productModel.countDocuments({ status: 'available', deleted: false })
  ])

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

//[GET] /products/:id
const getProductById = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { productId } = req.params as any

  const product = await productModel.findById(productId)

  if (!product) throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy thông tin sản phẩm.')

  res.status(StatusCodes.OK).json(
    response(StatusCodes.OK, 'Lấy thông tin sản phẩm thành công. ', {
      product
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
  getProductById,
  addProduct,
  editProduct,
  deleteProduct
}
