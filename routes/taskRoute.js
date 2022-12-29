import express from 'express';
import {taskController} from '../controllers';
import auth from '../middlewares/auth';
import admin from '../middlewares/admin';

const router = express.Router();

//Product

router.post('/add_task',auth, taskController.add);

router.get('/show_task/:id/:type', taskController.show_task);

router.get('/search/:key', taskController.search);



export default router;