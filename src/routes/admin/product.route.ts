import { Router } from 'express'
import { productController } from '../../controllers/admin'
import validate from '../../middlewares/validate.middleware'
import { productValidate } from '../../validates'

const productRouter = Router()

productRouter.get('/', productController.getProducts)

productRouter.get('/:id', validate(productValidate.checkId), productController.getProductById)

productRouter.post('/', validate(productValidate.createProduct), productController.addProduct)

productRouter.patch('/:productId', validate(productValidate.editProduct), productController.editProduct)

productRouter.delete('/:productId', validate(productValidate.checkId), productController.deleteProduct)

export default productRouter
