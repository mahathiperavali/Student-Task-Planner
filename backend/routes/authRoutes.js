const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

const router = express.Router()

console.log('Auth routes loaded')

// ===============================
// REGISTER USER
// ===============================
router.post('/register', async (req, res) => {
  console.log('REGISTER ROUTE HIT')

  try {
    const { name, email, password } = req.body

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Please provide name, email and password',
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists',
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    })

    // Send response
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)

    res.status(500).json({
      message: 'Registration failed',
      error: error.message,
    })
  }
})

// ===============================
// LOGIN USER
// ===============================
router.post('/login', async (req, res) => {
  console.log('LOGIN ROUTE HIT')

  try {
    const { email, password } = req.body

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide email and password',
      })
    }

    // Find user
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!passwordMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    )

    // Send response
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error('Login error:', error)

    res.status(500).json({
      message: 'Login failed',
      error: error.message,
    })
  }
})
console.log(
  'REGISTERED ROUTES:',
  router.stack
    .filter((layer) => layer.route)
    .map((layer) => `${Object.keys(layer.route.methods)[0].toUpperCase()} ${layer.route.path}`)
)
module.exports = router