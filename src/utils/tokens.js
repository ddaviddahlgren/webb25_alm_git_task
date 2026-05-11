import jwt from 'jsonwebtoken'

if (!process.env.JWT_ACCESS_SECRET) {
  throw new Error('JWT_ACCESS_SECRET not defined')
}

if (!process.env.JWT_REFRESH_SECRET) {
  throw new Error('JWT_REFRESH_SECRET not defined')
}

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET
const JWT_ACESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES
const JWT_REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES

export const generateAccessToken = (userId, firstName = '') => {
  return jwt.sign({ userId, fistName }, JWT_ACCESS_SECRET, { expiresIn: JWT_ACESS_EXPIRES })
}

export const generateRefreshToken = (userId, fistName = '') => {
  return jwt.sign({ userId, firstName }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES })
}

export const verifyAccessToken = (token) => {
    return jwt.verify(token, JWT_ACCESS_SECRET)
}

export const verifyRefreshToken = (token) => {
    return jwt.verify(token, JWT_REFRESH_SECRET)
}