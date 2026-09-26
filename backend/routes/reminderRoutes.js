const express = require('express')

const Reminder = require('../models/Reminder')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

// GET reminders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const reminders = await Reminder.find({
      user: req.userId,
    }).sort({
      date: 1,
      time: 1,
    })

    res.json(reminders)
  } catch (error) {
    console.error('Get reminders error:', error)

    res.status(500).json({
      message: 'Failed to get reminders',
    })
  }
})

// CREATE reminder
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      title,
      date,
      time,
    } = req.body

    if (!title || !date) {
      return res.status(400).json({
        message: 'Reminder title and date are required',
      })
    }

    const reminder = await Reminder.create({
      user: req.userId,
      title,
      date,
      time: time || '',
      completed: false,
    })

    res.status(201).json(reminder)
  } catch (error) {
    console.error('Create reminder error:', error)

    res.status(500).json({
      message: 'Failed to create reminder',
    })
  }
})

// UPDATE reminder
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      user: req.userId,
    })

    if (!reminder) {
      return res.status(404).json({
        message: 'Reminder not found',
      })
    }

    const {
      title,
      date,
      time,
      completed,
    } = req.body

    if (title !== undefined) reminder.title = title
    if (date !== undefined) reminder.date = date
    if (time !== undefined) reminder.time = time
    if (completed !== undefined) {
      reminder.completed = completed
    }

    await reminder.save()

    res.json(reminder)
  } catch (error) {
    console.error('Update reminder error:', error)

    res.status(500).json({
      message: 'Failed to update reminder',
    })
  }
})

// DELETE reminder
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    })

    if (!reminder) {
      return res.status(404).json({
        message: 'Reminder not found',
      })
    }

    res.json({
      message: 'Reminder deleted successfully',
    })
  } catch (error) {
    console.error('Delete reminder error:', error)

    res.status(500).json({
      message: 'Failed to delete reminder',
    })
  }
})

console.log('Reminder routes loaded')

module.exports = router