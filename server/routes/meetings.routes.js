
import express from 'express';
import protect from '../middlewares/auth.middleware.js';
import {
  getAllMeetings,
  getMeeting,
  createMeeting,
  summarizeMeeting,
  addAiTaskToList,
  deleteMeeting,
} from '../controllers/meetingController.js';

const router = express.Router();

router.get('/', protect, getAllMeetings);
router.get('/:id', protect, getMeeting);
router.post('/', protect, createMeeting);
router.post('/:id/summarize', protect, summarizeMeeting);
router.post('/:meetingId/tasks/:taskIndex', protect, addAiTaskToList);
router.delete('/:id', protect, deleteMeeting);

export default router;