import { Router } from 'express'
import * as userController from './controller/user.js'
import { auth } from './../../middleware/auth.js';

const router = Router();

router.get('/profile', auth() ,userController.getProfile);
router.post('/addMovie', auth() ,userController.addMovie);
router.post('/removeMovie', auth() ,userController.removeMovie);
router.post('/addTvShow', auth() ,userController.addTvShow);
router.post('/removeTvShow', auth() ,userController.removeTvShow);
router.get('/getWishList', auth() ,userController.getWishList);

export default router
