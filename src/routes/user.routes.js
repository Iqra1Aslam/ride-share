import { Router } from 'express'
import { user } from '../controllers/user/user.controller.js'
import { auth_middleware } from '../middleware/auth.middleware.js'
import { upload } from '../middleware/multer.middleware.js'

export const userRouter = Router()

userRouter.route('/user-details-add').patch(auth_middleware.check_user_role(['passenger', 'rider']), user.user_details_add)
userRouter.route('/user-details-update').patch(auth_middleware.check_user_role(['passenger', 'rider']), user.user_details_update)
userRouter.route('/user-delete/:id').patch(auth_middleware.check_user_role(['passenger', 'rider', 'admin']), user.user_details_delete)
// userRouter.route('/user-delete/:id').patch(auth_middleware.check_user_role([ 'admin']), auth_middleware.check_is_admin(), user.user_details_delete)
userRouter.route('/user-profile-image-add/:id').patch(upload.single('profile-image'), auth_middleware.check_user_role(['passenger', 'rider', 'admin']), user.user_profile_image_add)