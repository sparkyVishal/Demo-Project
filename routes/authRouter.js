import express from 'express';
import {registerController,loginController, userController, refreshController, productController,taskController} from '../controllers';
import auth from '../middlewares/auth';
import admin from '../middlewares/admin';

const router = express.Router();


router.post('/register', registerController.register);

router.post('/login', loginController.login);

router.get('/user_detail',auth, userController.user_details);

router.post('/refresh',auth, refreshController.refresh);

router.post('/logout',auth, loginController.logout);

router.post('/change_password',auth, loginController.change_password);

router.put('/update/',auth,userController.updateUser )

router.delete('/delete',auth, userController.deleteUser)

router.get('/searchUser', userController.searchUser)

export default router;


