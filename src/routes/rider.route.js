import { Router } from 'express'
import { auth } from '../controllers/user/auth.controller.js'
import { auth_middleware } from '../middleware/auth.middleware.js'
import { upload } from '../middleware/multer.middleware.js'
import { rider } from '../controllers/user/rider.controller.js'
export const  riderRouter = Router()
 riderRouter.route('/rider-info').post(auth_middleware.check_user_role(['passenger','rider','admin']),rider.rider_info)
 riderRouter.route('/license-image-add/:id').patch(upload.single('license-image'), auth_middleware.check_user_role(['passenger','rider','admin']),rider.rider_lisence_image_add)
 riderRouter.route('/rider-verified').patch(auth_middleware.check_user_role(['rider','admin']),rider.rider_is_verified)
 