import express from 'express';

const router = express.Router();

import auth from '../middlewares/auth';
import admin from '../middlewares/admin';


//task
// router.post('/add-task', auth, taskController.store);

export default router;