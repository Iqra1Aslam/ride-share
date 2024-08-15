import { Router } from 'express'
import { auth } from '../controllers/user/auth.controller.js'
import { auth_middleware } from '../middleware/auth.middleware.js'
import { upload } from '../middleware/multer.middleware.js'
import { driver } from '../controllers/user/driver.controller.js'
export const  driverRouter = Router()
 driverRouter.route('/driver-info').post(auth_middleware.check_user_role(['passenger','driver','admin']),driver.driver_info)
 driverRouter.route('/license-image-add/:id').patch(upload.single('license-image'), auth_middleware.check_user_role(['passenger','driver','admin']),driver.driver_lisence_image_add)
 driverRouter.route('/driver-verified').patch(auth_middleware.check_user_role(['driver','admin']),driver.driver_is_verified)
 driverRouter.route('/driver-fetch-rides').get(auth_middleware.check_user_role(['passenger','driver','admin']),driver.fetch_ride)
 driverRouter.route('/select-rides').post(auth_middleware.check_user_role(['passenger','driver','admin']),driver.select_ride)
 