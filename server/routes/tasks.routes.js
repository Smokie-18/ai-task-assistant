
import express from 'express';
import protect from '../middlewares/auth.middleware.js';
import {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';

const router = express.Router();

router.get('/', protect, getAllTasks);
router.get('/:id', protect, getTask);
router.post('/', protect, createTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

export default router;