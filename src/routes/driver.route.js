import { Router } from 'express'
import { auth } from '../controllers/user/auth.controller.js'
import { auth_middleware } from '../middleware/auth.middleware.js'
import { upload } from '../middleware/multer.middleware.js'
import { driver } from '../controllers/user/driver.controller.js'

export const driverRouter = Router();




driverRouter.route('/driver-verification').patch(auth_middleware.check_user_role(['driver','admin']), driver. driver_verification)

driverRouter.post('/driver-details:id', 
    auth_middleware.check_user_role(['driver', 'admin', 'passenger']), 
    driver.driver_details_add 
);

driverRouter.post('/upload-license-image/:id',
    auth_middleware.check_user_role(['driver', 'admin','passenger']),
    upload.single('lisence_image'),  // 'lisence_image' should match the form data key in your request
    driver.upload_driver_license_image
);
// export const  driverRouter = Router()
//  driverRouter.route('/driver-info').post(auth_middleware.check_user_role(['passenger','driver','admin']),driver.driver_info)
//  driverRouter.post('/upload-license-image/:id',
//     auth_middleware.check_user_role(['driver', 'admin', 'passenger']),
//     upload.single('lisence_image'),  // 'lisence_image' should match the form data key in your request
//     driver.upload_driver_license_image
// );
//  driverRouter.route('/driver-verified').patch(auth_middleware.check_user_role(['driver','admin']),driver.driver_is_verified)
//  driverRouter.route('/driver-fetch-rides').get(auth_middleware.check_user_role(['passenger','driver','admin']),driver.fetch_ride)
//  driverRouter.route('/select-rides').post(auth_middleware.check_user_role(['passenger','driver','admin']),driver.select_ride)
//  driverRouter.post('/driver-details:id', 
//     auth_middleware.check_user_role(['driver', 'admin', 'passenger']), 
//     driver.driver_details_add 
// );
