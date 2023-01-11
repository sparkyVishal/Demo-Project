import express from 'express';

import {blogController} from '../controllers';

const router = express.Router();

router.get('/show-blogs', blogController.show)
router.post('/add', blogController.add)
router.put('/update/:id', blogController.update)

export default router;