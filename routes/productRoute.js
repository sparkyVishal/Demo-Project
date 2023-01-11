import express from 'express';
import {registerController,loginController, userController, refreshController, productController,taskController} from '../controllers';
import auth from '../middlewares/auth';
import admin from '../middlewares/admin';

const router = express.Router();

//Product

router.post('/add_product', productController.store);
router.put('/update_product/:id', productController.update);
router.delete('/delete_product/:id', productController.destroy);
router.get('/products', productController.index);
router.get('/product/:id', productController.show);
// router.get('/search/:key', productController.searchProduct);

router.get('/search/:key', productController.search)


router.get('/search_by_name', productController.productName)
router.get('/search_by_category', productController.productCategory)
router.get('/search_by_discount', productController.productDiscount)
router.get('/search_by_price', productController.productdiscountprice)
router.get('/search_by_pricee', productController.producttprice)


router.post('/updateall', productController.updateAll)

router.get('/cheapProduct', productController.cheapProduct)

export default router;