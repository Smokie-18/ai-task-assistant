// server/controllers/meetingController.js
import Meeting from '../models/Meeting.js';
import Task from '../models/Task.js';
import openai from '../config/openai.js';

// --------------------------------
// GET ALL MEETINGS
// --------------------------------
export const getAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ user: req.user.id });
    res.status(200).json(meetings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------------------
// GET SINGLE MEETING
// --------------------------------
export const getMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    if (meeting.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json(meeting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------------------
// CREATE MEETING
// --------------------------------
export const createMeeting = async (req, res) => {
  try {
    const { title, notes } = req.body;

    const meeting = await Meeting.create({
      title,
      notes,
      user: req.user.id,
    });

    res.status(201).json(meeting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------------------
// SUMMARIZE MEETING — OpenAI call
// --------------------------------
export const summarizeMeeting = async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ message: 'OPENAI_API_KEY is not configured' });
    }

    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    if (meeting.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (meeting.isSummarized) {
      return res.status(400).json({ message: 'Meeting already summarized' });
    }

    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a productivity assistant. 
          Given meeting notes, you will:
          1. Write a concise summary of the meeting
          2. Extract action items as tasks with priorities
          
          Respond in this exact JSON format:
          {
            "summary": "meeting summary here",
            "tasks": [
              { "title": "task title", "priority": "low | medium | high" },
              { "title": "task title", "priority": "low | medium | high" }
            ]
          }`,
        },
        {
          role: 'user',
          content: meeting.notes,
        },
      ],
      response_format: { type: 'json_object' },
    });


    const content = response.choices[0].message.content;
    const result = JSON.parse(content);

    const aiTasks = Array.isArray(result.tasks)
      ? result.tasks
          .filter((task) => task?.title)
          .map((task) => ({
            title: task.title,
            priority: ['low', 'medium', 'high'].includes(task.priority)
              ? task.priority
              : 'medium',
            isAdded: false,
          }))
      : [];


    meeting.summary = result.summary;
    meeting.aiTasks = aiTasks;
    meeting.isSummarized = true;
    await meeting.save();

    res.status(200).json(meeting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------------------
// AI TASK KO TASK LIST MEIN ADD KARO
// --------------------------------
export const addAiTaskToList = async (req, res) => {
  try {
    const { meetingId, taskIndex } = req.params;
    const parsedTaskIndex = Number.parseInt(taskIndex, 10);

    if (Number.isNaN(parsedTaskIndex) || parsedTaskIndex < 0) {
      return res.status(400).json({ message: 'Invalid task index' });
    }

    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    if (meeting.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const aiTask = meeting.aiTasks[parsedTaskIndex];

    if (!aiTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (aiTask.isAdded) {
      return res.status(400).json({ message: 'Task already added' });
    }


    await Task.create({
      title: aiTask.title,
      priority: aiTask.priority,
      meetingRef: meeting._id,
      user: req.user.id,
    });

   
    meeting.aiTasks[parsedTaskIndex].isAdded = true;
    await meeting.save();

    res.status(201).json({ message: 'Task added successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------------------
// DELETE MEETING
// --------------------------------
export const deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    if (meeting.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Task.deleteMany({ meetingRef: meeting._id, user: req.user.id });
    await meeting.deleteOne();

    res.status(200).json({ message: 'Meeting deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
