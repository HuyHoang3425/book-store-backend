import { Request, Response } from 'express'
import slugify from 'slugify'

import { ApiError, catchAsync, response } from '../../utils'
import { productModel } from '../../models'
import { StatusCodes } from 'http-status-codes'
import { IProduct } from '../../models/product.model'
import { productConstant } from '../../constants'

//[GET] /products
const getProducts = catchAsync(async (req: Request, res: Response): Promise<void> => {
  //pagination
  const { page = 1, limit = 3, sortKey, sortValue, status, maxPrice, minPrice, keyword } = req.query as any
  const skip = (+page - 1) * +limit
  //end pagination

  //sort
  const sort: Record<string, any> = {}
  if (sortKey && sortValue) sort[sortKey] = sortValue
  sort.createdAt = -1
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
  // end filter

  //search
  // Format keyword để search
  let formatKeyword: string
  let regexSlug: RegExp
  let regexKeyword: RegExp
  let conditions: Record<string, any> = { ...find }
  if (keyword) {
    formatKeyword = slugify(keyword, {
      replacement: '-',
      lower: false,
      locale: 'vi',
      trim: true
    })
    regexSlug = new RegExp(formatKeyword, 'i')
    regexKeyword = new RegExp(keyword, 'i')
    conditions.$or = [
      { slug: regexSlug },
      { title: regexKeyword },
      { authors: regexKeyword },
      { publisher: regexKeyword }
    ]
  }

  // Query
  const [products, totalProducts] = await Promise.all([
    productModel.find(conditions).sort(sort).skip(skip).limit(+limit).select('-__v').lean(),
    productModel.countDocuments(conditions)
  ])

  //end search

  res.status(StatusCodes.OK).json(
    response(StatusCodes.OK, 'Lấy danh sách sản phẩm thành công', {
      products,
      page: +page,
      totalPage: Math.ceil(totalProducts / +limit),
      totalProducts,
      limit: +limit,
      keyword
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
//[PATCH] /products/:productId
const editProduct = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params
  const productData = req.body as CreateProductDto

  const product = await productModel.findByIdAndUpdate(productId, productData, { new: true })

  if (!product) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy sản phẩm.')
  }

  res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Sửa sản phẩm thành công.', { product }))
})
//[DELETE] /products/:productId
const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params

  const product = await productModel.findByIdAndUpdate(
    productId,
    { deleted: true, deletedAt: new Date() },
    { new: true }
  )

  if (!product) {
    return res.status(StatusCodes.NOT_FOUND).json(response(StatusCodes.NOT_FOUND, 'Không tìm thấy sản phẩm.'))
  }

  res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Xoá sản phẩm thành công.', { product }))
})

// [PATCH] /products/action
const action = catchAsync(async (req: Request, res: Response) => {
  const { ids, action } = req.body as any

  let updateData: any = {}

  switch (action) {
    case productConstant.ACTION.DELETEALL:
      updateData = { deleted: true, deletedAt: new Date() }
      break

    case productConstant.STATUS.AVAILABLE:
    case productConstant.STATUS.DISCONTINUED:
    case productConstant.STATUS.OUT_OF_STOCK:
      updateData = { status: action }
      break

    default:
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Hành động không hợp lệ.')
  }

  await productModel.updateMany({ _id: { $in: ids } }, updateData)

  return res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Thực hiện hành động thành công.'))
})

// [GET] /products/restore
const restore = catchAsync(async (req: Request, res: Response) => {
  //pagination
  const { page = 1, limit = 10, sortKey, sortValue, status, maxPrice, minPrice, keyword } = req.query as any
  const skip = (+page - 1) * +limit
  //end pagination

  //sort
  const sort: Record<string, any> = {}
  if (sortKey && sortValue) sort[sortKey] = sortValue
  sort.createdAt = -1
  //end sort

  // filter
  const find: Record<string, any> = {
    deleted: true
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
  // end filter

  //search
  // Format keyword để search
  let formatKeyword: string
  let regexSlug: RegExp
  let regexKeyword: RegExp
  let conditions: Record<string, any> = { ...find }
  if (keyword) {
    formatKeyword = slugify(keyword, {
      replacement: '-',
      lower: false,
      locale: 'vi',
      trim: true
    })
    regexSlug = new RegExp(formatKeyword, 'i')
    regexKeyword = new RegExp(keyword, 'i')
    conditions.$or = [
      { slug: regexSlug },
      { title: regexKeyword },
      { authors: regexKeyword },
      { publisher: regexKeyword }
    ]
  }

  // Query
  const [products, totalProducts] = await Promise.all([
    productModel.find(conditions).sort(sort).skip(skip).limit(+limit).select('-__v').lean(),
    productModel.countDocuments(conditions)
  ])

  //end search

  res.status(StatusCodes.OK).json(
    response(StatusCodes.OK, 'Lấy danh sách sản phẩm đã xoá thành công thành công', {
      products,
      page: +page,
      totalPage: Math.ceil(totalProducts / +limit),
      totalProducts,
      limit: +limit,
      keyword
    })
  )
})

// [PATCH] /products/restore/:productId
const restoreProductById = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params
  const product = await productModel.findByIdAndUpdate(productId, { deleted: false }, { new: true })

  if (!product) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy sản phẩm.')
  }

  res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'khôi phục sản phẩm thành công.', { product }))
})

//[DELETE] /products/restore/:productId
const deleteProductDestroy = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params

  const product = await productModel.findByIdAndDelete(productId)

  if (!product) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy sản phẩm.')
  }

  res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Xoá sản phẩm vĩnh viễn thành công.'))
})
export default {
  getProducts,
  getProductById,
  addProduct,
  editProduct,
  deleteProduct,
  action,
  restore,
  restoreProductById,
  deleteProductDestroy
}
