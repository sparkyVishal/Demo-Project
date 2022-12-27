import express from 'express';
import {taskController} from '../controllers';
import auth from '../middlewares/auth';
import admin from '../middlewares/admin';

const router = express.Router();

//Product

router.post('/add_task', taskController.add);

router.get('/show_task/:id', taskController.show_task);


export default router;