const express = require('express')
const { register, login } = require('../controllers/authController')
const { authenticateToken } = require('../middleware/auth')

const router = express.Router()

router.post('/register', authenticateToken, register)
router.post('/login', authenticateToken, login)

module.exports = router