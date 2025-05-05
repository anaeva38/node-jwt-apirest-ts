import dotenv from 'dotenv';
dotenv.config()
import express from 'express'
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'

const app = express()

app.use(express.json())

// Routers
app.use('/auth', authRoutes)
app.use('/users', userRoutes)

console.log("Se esta ejecutando app.ts")

export default app