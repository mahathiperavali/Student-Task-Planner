const express = require('express')
const taskRoutes = require('./routes/taskRoutes')
const cors = require('cors')
require('dotenv').config()

const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Show every request in terminal
app.use((req, res, next) => {
  console.log('REQUEST:', req.method, req.url)
  next()
})

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'Student Task Planner API is running!',
  })
})

// DIRECT TEST POST ROUTE
app.post('/test-register', (req, res) => {
  console.log('TEST ROUTE HIT')

  res.json({
    message: 'Test POST route works!',
  })
})

// Authentication routes
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)

const eventRoutes = require('./routes/eventRoutes')
app.use('/api/events', eventRoutes)
const reminderRoutes = require('./routes/reminderRoutes')
app.use('/api/reminders', reminderRoutes)


// Start server
const PORT = process.env.PORT || 5000

async function startServer() {
  await connectDB()

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

startServer()