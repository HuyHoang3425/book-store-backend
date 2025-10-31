import { Router } from 'express'
import { categoryController } from '../../controllers/admin'
import validate from '../../middlewares/validate.middleware'
import { categoryValidate } from '../../validates'

const categoryRouter = Router()

categoryRouter.get('/', categoryController.getCategories)

categoryRouter.get(
  '/:categoryId',
  validate(categoryValidate.checkCategoryId),
  validate(categoryValidate.editCategory),
  categoryController.getCategoryById
)

categoryRouter.post('/', validate(categoryValidate.addCategory), categoryController.addCategory)

categoryRouter.patch(
  '/:categoryId',
  validate(categoryValidate.checkCategoryId),
  validate(categoryValidate.editCategory),
  categoryController.editCategory
)
categoryRouter.delete('/:categoryId', validate(categoryValidate.checkCategoryId), categoryController.deletedCategory)

export default categoryRouter
