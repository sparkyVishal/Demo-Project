import express from 'express';
import {taskController} from '../controllers';
import auth from '../middlewares/auth';
import admin from '../middlewares/admin';

const router = express.Router();

//Product

router.post('/add_task',auth, taskController.add);

// router.get('/show_task/:id/:type', taskController.show_task);

router.get('/show_task',auth, taskController.show_task);

router.get('/search/:key', taskController.search);

router.delete('/task_delete/:id',auth, taskController.deleteTask)

router.post('/modify', taskController.modify)

router.post('/remove_key', taskController.removeKey)

router.get('/findUser', taskController.showUserTaskInfo)

router.get('/findTask', taskController.showTaskUserInfo)

router.get('/add_field', taskController.addField)

router.get('/users',taskController.userList)

router.get('/user/:id', taskController.singleUser)

router.get('/task_list', taskController.taskList)

router.get('/single_task/:id', taskController.singleTask)



export default router;