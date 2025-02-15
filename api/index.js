require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const User = require('./models/User.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cookieParser())

// Your JWT secret and bcrypt salt
const bcryptSalt = bcrypt.genSaltSync(10)
const jwtSecret = 'dummykey' // Replace with your actual secret

// CORS configuration allowing cookies from the frontend
app.use(
  cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true, // Allow cookies to be sent
  })
)

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to mongoDB'))
  .catch((err) => {
    console.log('Error:', err)
  })

const PORT = process.env.PORT || 4000

app.get('/test', (req, res) => {
  res.json('Test Ok')
})

// Register Route
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    })
    res.json(userDoc)
  } catch (error) {
    res.status(422).json(error)
  }
})

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body
  const userDoc = await User.findOne({ email })
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password)
    if (passOk) {
      jwt.sign(
        { email: userDoc.email, id: userDoc._id },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err
          res
            .cookie('token', token, {
              httpOnly: true, // Prevent JavaScript access
              secure: false, // Set to true for production over HTTPS
              sameSite: 'lax', // To handle cross-origin cookies
            })
            .json(userDoc)
        }
      )
    } else {
      res.status(422).json('Password incorrect')
    }
  } else {
    res.status(404).json('User not found')
  }
})

// Profile Route (access token from cookies)
app.get('/profile', (req, res) => {
  const { token } = req.cookies
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err
      const userDoc = await User.findById(userData.id)
      res.json(userDoc)
    })
  } else {
    res.json(null)
  }
})

app.post('/logout', (req, res) => {
  res
    .cookie('token', '', {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Secure cookies in production only
      sameSite: 'lax', // To handle cross-origin cookies
      path: '/', // Ensure the cookie is deleted for the entire site
    })
    .json({ message: 'Logged out successfully' })
})

// Start the server
app.listen(PORT, () => console.log(`Running on port ${PORT}`))
