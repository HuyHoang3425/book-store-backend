import { Router } from 'express'
import { productController } from '../../controllers/admin'
import validate from '../../middlewares/validate.middleware'
import { productValidate } from '../../validates'

const productRouter = Router()

productRouter.get('/', productController.getProducts)

productRouter.get('/restore', productController.restore)

productRouter.get('/:productId', validate(productValidate.checkId), productController.getProductById)


productRouter.post('/', validate(productValidate.createProduct), productController.addProduct)


productRouter.patch('/action', validate(productValidate.action), productController.action)

productRouter.patch('/:productId', validate(productValidate.editProduct), productController.editProduct)

productRouter.patch('/restore/:productId',validate(productValidate.checkId), productController.restoreProductById)


productRouter.delete('/:productId', validate(productValidate.checkId), productController.deleteProduct)
productRouter.delete('/restore/:productId', validate(productValidate.checkId), productController.deleteProductDestroy)


export default productRouter
