import express from 'express';

const router = express.Router();
import {registerController,loginController, userController, refreshController} from '../controllers';
import auth from '../middlewares/auth';

router.post('/register', registerController.register);

router.post('/login', loginController.login);

router.get('/user_detail',auth, userController.user_details);

router.post('/refresh',auth, refreshController.refresh);

router.post('/logout',auth, loginController.logout);

export default router;