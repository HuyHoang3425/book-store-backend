import { Router } from 'express'
import { searchController } from '../../controllers/admin'

const searchRouter = Router()

searchRouter.get('/:resource', searchController.search)

export default searchRouter
