import { Router } from 'express'
import multer from 'multer'
import { productController } from '../../controllers/admin'
import validate from '../../middlewares/validate.middleware'
import { productValidate } from '../../validates'
import { cloudinaryMiddleware } from '../../middlewares'

const upload = multer()

const productRouter = Router()

productRouter.get('/', productController.getProducts)

productRouter.post(
  '/',
  upload.array('images', 5),
  cloudinaryMiddleware.uploadImages,
  validate(productValidate.createProduct),
  productController.addProduct
)

productRouter.put(
  '/:productId',
  upload.array('images', 5),
  cloudinaryMiddleware.uploadImages,
  validate(productValidate.createProduct),
  productController.editProduct
)

productRouter.delete('/:productId', productController.deleteProduct)

export default productRouter
