import express from 'express';
import {categoryController} from '../controllers';
import auth from '../middlewares/auth';
import admin from '../middlewares/admin';

const router = express.Router();

router.post('/add-category', categoryController.add)

router.post('/update-category/:id', categoryController.update)


router.delete('/delete-category/:id', categoryController.destroy)

router.get('/list-category', categoryController.index)

router.get('/detail-category/:id', categoryController.show)


export default router;