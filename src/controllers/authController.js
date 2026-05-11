const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/User')

function signToken(user) {
  return jwt.sign({ sub: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

exports.register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body
  if (!firstName || !email || !password)
    return res.status(400).json({ message: 'firstName, email and password are required' })
  try {
    const user = await User.create({ firstName, lastName, email, passwordHash: password })
    res.status(201).json({ token: signToken(user) })
  } catch (e) {
    if (e.code === 11000 || e.message?.includes('Email is already in use'))
      return res.status(409).json({ message: 'Email already in use' })
    res.status(400).json({ message: e.message })
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email }).select('+passwordHash')
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })
  const match = await bcrypt.compare(password, user.passwordHash)
  if (!match) return res.status(401).json({ message: 'Invalid credentials' })
  res.json({ token: signToken(user) })
}