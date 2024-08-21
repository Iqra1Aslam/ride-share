import { Router } from 'express'
import { auth } from '../controllers/user/auth.controller.js'
import { auth_middleware } from '../middleware/auth.middleware.js'
import { vehicle } from '../controllers/user/vehicle.controller.js'
import { upload } from '../middleware/multer.middleware.js'

export const vehicleRouter = Router()
vehicleRouter.route('/vehicle-info').post(auth_middleware.check_user_role(['driver', 'passenger']),vehicle.vehicle_info)

vehicleRouter.route('/vehicle_images_upload/:id').patch(auth_middleware.check_user_role(['admin', 'driver']), upload.fields([
    {
        name: 'vehicle_image',
        maxCount: 1
    },
    {
        name: 'vehicle_dox_image',
        maxCount: 1
    }
]), vehicle.vehicle_images_upload)



vehicleRouter.route('/vehicle-verified').patch(auth_middleware.check_user_role(['driver','admin']),vehicle.is_verified)
//  .route('/license-image-add/:id').patch(upload.single('license-image'), auth_middleware.check_user_role(['passenger','driver','admin']),driver.driver_lisence_image_add)
vehicleRouter.route('/is-nearestVehicle').patch(auth_middleware.check_user_role(['driver', 'passenger']),vehicle.is_nearestVehicle)
vehicleRouter.route('/publish-ride').post(auth_middleware.check_user_role(['driver', 'passenger']),vehicle.publish_ride)
