import { Router } from 'express';
import { auth } from '../controllers/user/auth.controller.js';
import { auth_middleware } from '../middleware/auth.middleware.js';

export const authRouter = Router()
authRouter.route('/register').post(auth.register)
authRouter.route('/login').post(auth.login)
authRouter.route('/verify-otp').post(auth_middleware.check_user_role(['driver','passenger']),auth.verify_otp)
authRouter.route('/forget').post(auth.forget_password)
authRouter.route('/reset').post(auth.reset_password)