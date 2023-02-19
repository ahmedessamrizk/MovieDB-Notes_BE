import { Router } from 'express'
import * as userController from './controller/user.js'
import { auth } from './../../middleware/auth.js';

const router = Router();

router.get('/profile', auth() ,userController.getProfile);
router.put('/addMovie', auth() ,userController.addMovie);
router.put('/removeMovie', auth() ,userController.removeMovie);
router.put('/addTvShow', auth() ,userController.addTvShow);
router.put('/removeTvShow', auth() ,userController.removeTvShow);
router.get('/getWishList', auth() ,userController.getWishList);

export default router
