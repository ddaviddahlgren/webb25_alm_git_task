const bcrypt = require('bcrypt')
const User = require('../models/User')
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/tokens.js'

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body

    const existingUser = await User.findByEmail(email)
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' })
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      passwordHash: password
    })

    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken(user._id)

    res.status(201).json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      },
      accessToken,
      refreshToken
    })
  } catch (error) {
    console.error('Error while registering: ', error)
    res.status(500).json({ error: error.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findByEmail(email)
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken(user._id)

    res.status(201).json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      },
      accessToken,
      refreshToken
    })
  } catch (error) {
    console.error("Error while logging in: ", error)
    res.status(500).json({ error: error.message })
  }
}