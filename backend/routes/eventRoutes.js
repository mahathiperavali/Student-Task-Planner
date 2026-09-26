const express = require('express')

const Event = require('../models/Event')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

// GET all events for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const events = await Event.find({
      user: req.userId,
    }).sort({
      date: 1,
      time: 1,
    })

    res.json(events)
  } catch (error) {
    console.error('Get events error:', error)

    res.status(500).json({
      message: 'Failed to get events',
    })
  }
})

// CREATE event
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      title,
      date,
      time,
      description,
    } = req.body

    if (!title || !date) {
      return res.status(400).json({
        message: 'Event title and date are required',
      })
    }

    const event = await Event.create({
      user: req.userId,
      title,
      date,
      time: time || '',
      description: description || '',
    })

    res.status(201).json(event)
  } catch (error) {
    console.error('Create event error:', error)

    res.status(500).json({
      message: 'Failed to create event',
    })
  }
})

// UPDATE event
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      user: req.userId,
    })

    if (!event) {
      return res.status(404).json({
        message: 'Event not found',
      })
    }

    const {
      title,
      date,
      time,
      description,
    } = req.body

    if (title !== undefined) event.title = title
    if (date !== undefined) event.date = date
    if (time !== undefined) event.time = time
    if (description !== undefined) {
      event.description = description
    }

    await event.save()

    res.json(event)
  } catch (error) {
    console.error('Update event error:', error)

    res.status(500).json({
      message: 'Failed to update event',
    })
  }
})

// DELETE event
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    })

    if (!event) {
      return res.status(404).json({
        message: 'Event not found',
      })
    }

    res.json({
      message: 'Event deleted successfully',
    })
  } catch (error) {
    console.error('Delete event error:', error)

    res.status(500).json({
      message: 'Failed to delete event',
    })
  }
})

console.log('Event routes loaded')

module.exports = router