import { Router } from 'express'
import * as authController from './controller/auth.js'
import { validation } from './../../middleware/validation.js';
import * as validators from './authValidation.js'

const router = Router();

router.post('/signup', validation(validators.signUp), authController.SignUp)
router.get('/confirmEmail/:token', validation(validators.confirmEmail), authController.confirmEmail)
router.post('/signin', validation(validators.signIn), authController.SignIn)
router.post('/forgetPassword', validation(validators.forgetPassword), authController.forgetPassword);
router.post('/recoverAccount', validation(validators.recoverPassword), authController.recoverPassword);



export default router