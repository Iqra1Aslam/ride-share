import { Router } from 'express'
import { auth } from '../controllers/user/auth.controller.js'
import { auth_middleware } from '../middleware/auth.middleware.js'
import {ride} from "../controllers/user/ride.controller.js"
export const authRouter = Router()
authRouter.route('/register').post(auth.register)
authRouter.route('/login').post(auth.login)
authRouter.route('/verify-otp').post(auth_middleware.check_user_role(['passenger','driver']), auth.verify_otp)
authRouter.route('/ride-info').post(auth_middleware.check_user_role(['passenger','driver']), auth.ride_info)
