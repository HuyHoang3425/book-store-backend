import { Request, Response } from 'express'

import { ApiError, catchAsync, response } from '../../utils'
import { categoryModel } from '../../models'
import { StatusCodes } from 'http-status-codes'
import slugify from 'slugify'
import { ICategory } from '../../models/category.model'

type CategoryNode = {
  _id: string
  title: string
  children?: CategoryNode[]
}

function buildCategoryTree(categories: any[], parentId: string | null = null): CategoryNode[] {
  return categories
    .filter((cat) => String(cat.parentId) === String(parentId) && cat.status && !cat.deleted)
    .map((cat) => ({
      _id: cat._id,
      title: cat.title,
      children: buildCategoryTree(categories, cat._id)
    }))
}

//[GET] /category
const getCategories = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { page = 1, limit = 10 } = req.params as any
  const skip = (+page - 1) * +limit

  const [categories, totalCategory] = await Promise.all([
    categoryModel.find({ deleted: false }).skip(skip).limit(+limit).lean(),
    categoryModel.countDocuments({ deleted: false })
  ])

  const tree = buildCategoryTree(categories)
  res.status(StatusCodes.OK).json(
    response(StatusCodes.OK, 'Lấy danh sách danh mục thành công.', {
      categories: tree,
      page: +page,
      totalPage: Math.ceil(totalCategory / +limit),
      totalCategory,
      limit: +limit
    })
  )
})

//[GET] /category/:categoryId
const getCategoryById = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { categoryId } = req.params as any

  const category = await categoryModel.findById(categoryId).lean()

  if (!category) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Danh mục không tồn tại.')
  }

  res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Lấy danh mục thành công.', category))
})

//[POST] /category
export type CreateCategoryDto = Pick<ICategory, 'title'>
const addCategory = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { title } = req.body as any
  const categoryData = req.body as CreateCategoryDto

  if (title) {
    const slug = slugify(title, {
      replacement: '-',
      lower: true,
      locale: 'vi',
      trim: true
    })

    const category = await categoryModel.findOne({ slug })

    if (category) {
      throw new ApiError(StatusCodes.CONFLICT, 'Danh mục này đã tồn tại.')
    }
  }

  const newCategory = await categoryModel.create(categoryData)

  res.status(StatusCodes.CREATED).json(
    response(StatusCodes.CREATED, 'Tạo danh mục thành công.', {
      newCategory
    })
  )
})

//[PATCH] /category/:categoryId
const editCategory = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { categoryId } = req.params as any
  const { title } = req.body as any

  const existingCategory = await categoryModel.findById(categoryId)
  if (!existingCategory) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Danh mục không tồn tại.')
  }

  if (title) {
    const slug = slugify(title, {
      replacement: '-',
      lower: true,
      locale: 'vi',
      trim: true
    })
    const category = await categoryModel.findOne({ slug, _id: { $ne: categoryId } })
    if (category) {
      throw new ApiError(StatusCodes.CONFLICT, 'Danh mục này đã tồn tại.')
    }
  }

  const updatedCategory = await categoryModel.findByIdAndUpdate(categoryId, req.body, { new: true })

  res.status(StatusCodes.OK).json(
    response(StatusCodes.OK, 'Cập nhật danh mục thành công.', {
      updatedCategory
    })
  )
})

//[DELETE] /category/:categoryId
const deletedCategory = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { categoryId } = req.params as any

  const existingCategory = await categoryModel.findById(categoryId)
  if (!existingCategory) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Danh mục không tồn tại.')
  }

  await categoryModel.findByIdAndUpdate(categoryId, { deleted: true, deletedAt: new Date() })

  res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Xoá danh mục thành công.'))
})

export default {
  getCategories,
  getCategoryById,
  addCategory,
  editCategory,
  deletedCategory
}
