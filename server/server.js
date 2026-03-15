import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import gamesRouter from './routes/games.js'
import { initCache } from './middleware/cache.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())


initCache()
app.use('/api', gamesRouter)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Server on port ${PORT}`))



// app.get('/api/games', async (req, res) => {
//     const apiUrl = `https://api.steampowered.com/IStoreService/GetAppList/v1/?key=${KEY}`
//     // const apiUrl = 'https://store.steampowered.com/api/appdetails/?appids=3764200'
//     try {
//         const controller = new AbortController()
//         const timeoutId = setTimeout(() => controller.abort(), 10000)

//         const response = await fetch(apiUrl, {
//             signal: controller.signal,
//             headers: { 'User-Agent': 'Mozilla/5.0 (compatible Node.js)' }
//         })
//         clearTimeout(timeoutId)

//         if (!response.ok) {
//             throw new Error(`Steam error: ${response.status}`)
//         }

//         const data = await response.json()
//         res.json(data || { error: 'No data' })
//     } catch (error) {
//         if (error.name === 'AbortError') {
//             return res.status(408).json({ error: 'Request timeout' })
//         }
//         res.status(500).json({ error: error.message })
//     }
// })