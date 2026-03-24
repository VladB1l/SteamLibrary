import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import gamesRouter from './routes/games.js'
import authRouter from './routes/auth.js'

import { initCache } from './middleware/cache.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())


initCache()
app.use('/api', gamesRouter)
app.use('/api/auth', authRouter)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Server on port ${PORT}`))