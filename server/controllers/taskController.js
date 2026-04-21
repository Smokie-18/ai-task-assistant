
import Task from '../models/Task.js';

// --------------------------------
// GET ALL TASKS
// --------------------------------
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------------------
// GET SINGLE TASK
// --------------------------------
export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

  
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------------------
// CREATE TASK
// --------------------------------
export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, meetingRef } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      meetingRef: meetingRef || null,
      user: req.user.id,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------------------
// UPDATE TASK
// --------------------------------
export const updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, meetingRef } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

   
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
       { title, description, status, priority, dueDate, meetingRef } ,
      { new: true , runValidators : true },
              
    );

    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------------------
// DELETE TASK
// --------------------------------
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

   
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await task.deleteOne();

    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
