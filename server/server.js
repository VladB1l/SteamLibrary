import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import gamesRouter from './routes/games.js'
import authRouter from './routes/auth.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

await mongoose.connect(process.env.MONGO_URI)
console.log('MongoDB connected')

app.use('/api', gamesRouter)
app.use('/api/auth', authRouter)

const PORT = process.env.PORT || 4000
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server on port ${PORT}`))
}

export default app