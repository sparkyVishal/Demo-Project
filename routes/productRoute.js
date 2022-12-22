import express from 'express';
import {registerController,loginController, userController, refreshController, productController,taskController} from '../controllers';
import auth from '../middlewares/auth';
import admin from '../middlewares/admin';

const router = express.Router();

//Product

router.post('/add_product',[auth,admin], productController.store);
router.put('/update_product/:id',[auth,admin], productController.update);
router.delete('/delete_product/:id',[auth,admin], productController.destroy);
router.get('/products', productController.index);
router.get('/product/:id', productController.show);

export default router;