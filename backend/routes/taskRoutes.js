const express = require('express')

const Task = require('../models/Task')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

// ===============================
// GET ALL TASKS FOR LOGGED-IN USER
// ===============================

router.get('/', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.userId,
    }).sort({
      createdAt: -1,
    })

    res.json(tasks)
  } catch (error) {
    console.error('Get tasks error:', error)

    res.status(500).json({
      message: 'Failed to get tasks',
    })
  }
})

// ===============================
// CREATE TASK
// ===============================

router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      title,
      category,
      dueDate,
      priority,
    } = req.body

    if (!title) {
      return res.status(400).json({
        message: 'Task title is required',
      })
    }

    const task = await Task.create({
      user: req.userId,
      title,
      category: category || 'College',
      dueDate: dueDate || 'No date',
      priority: priority || 'Medium',
      completed: false,
    })

    res.status(201).json(task)
  } catch (error) {
    console.error('Create task error:', error)

    res.status(500).json({
      message: 'Failed to create task',
    })
  }
})

// ===============================
// UPDATE TASK
// ===============================

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.userId,
    })

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      })
    }

    const {
      title,
      category,
      dueDate,
      priority,
      completed,
    } = req.body

    if (title !== undefined) task.title = title
    if (category !== undefined) task.category = category
    if (dueDate !== undefined) task.dueDate = dueDate
    if (priority !== undefined) task.priority = priority
    if (completed !== undefined) task.completed = completed

    await task.save()

    res.json(task)
  } catch (error) {
    console.error('Update task error:', error)

    res.status(500).json({
      message: 'Failed to update task',
    })
  }
})

// ===============================
// DELETE TASK
// ===============================

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    })

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      })
    }

    res.json({
      message: 'Task deleted successfully',
    })
  } catch (error) {
    console.error('Delete task error:', error)

    res.status(500).json({
      message: 'Failed to delete task',
    })
  }
})

module.exports = router