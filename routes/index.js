import express from 'express';

const router = express.Router();
import {registerController,loginController, userController, refreshController, productController,taskController} from '../controllers';
import auth from '../middlewares/auth';
import admin from '../middlewares/admin';

router.post('/register', registerController.register);

router.post('/login', loginController.login);

router.get('/user_detail',auth, userController.user_details);

router.post('/refresh',auth, refreshController.refresh);

router.post('/logout',auth, loginController.logout);

router.post('/change_password',auth, loginController.change_password);

//Product

router.post('/add_product',[auth,admin], productController.store);
router.put('/update_product/:id',[auth,admin], productController.update);
router.delete('/delete_product/:id',[auth,admin], productController.destroy);
router.get('/products', productController.index);
router.get('/product/:id', productController.show);

//task
router.post('/add-task', auth, taskController.store);

export default router;