import mongoose from 'mongoose'

const Game = mongoose.model('Game', new mongoose.Schema({}, { strict: false }), 'games')

class GameController {
    async getAllGames(req, res) {
        try {
            const games = await Game.find({}, { _id: 0 })
            console.log(`getAllGames: ${games.length} games returned`)
            res.json({ total: games.length, games })
        } catch (e) {
            console.error('getAllGames error:', e.message)
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    async getGameById(req, res) {
        try {
            const { id } = req.query
            if (!id) {
                return res.status(400).json({ error: 'ID required' })
            }
            const game = await Game.findOne({ sid: parseInt(id, 10) }, { _id: 0 })
            if (!game) {
                return res.status(404).json({ error: 'Game not found' })
            }
            const gameObj = game.toObject()

            try {
                const response = await fetch(`https://store.steampowered.com/api/appdetails?appids=${gameObj.sid}`)
                if (response.ok) {
                    const data = await response.json()
                    const appData = data[gameObj.sid]
                    if (appData?.success && appData?.data) {
                        gameObj.screenshots = appData.data.screenshots || []
                    }
                }
            } catch (e) {
                console.error(`getGameById Steam fetch error (sid: ${id}):`, e.message)
            }

            console.log(`getGameById: game ${id} returned`)
            return res.json(gameObj)
        } catch (e) {
            console.error('getGameById error:', e.message)
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    async getTop20Games(req, res) {
        try {
            const games = await Game.find({}, { _id: 0 }).sort({ meta_score: -1 }).limit(20)
            console.log(`getTop20Games: ${games.length} games returned`)
            res.json({ total: games.length, games })
        } catch (e) {
            console.error('getTop20Games error:', e.message)
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    async getGamesByGenre(req, res) {
        try {
            const { genre, page = '0' } = req.query
            if (!genre) {
                return res.status(400).json({ error: 'Genre required' })
            }
            const pageNum = parseInt(page) || 0
            const limitNum = 21
            const normalized = genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase()

            const allGames = await Game.find(
                { genres: { $regex: normalized, $options: 'i' } },
                { _id: 0 }
            ).sort({ meta_score: -1 })

            const total = allGames.length
            const games = allGames.slice(pageNum * limitNum, (pageNum + 1) * limitNum)

            console.log(`getGamesByGenre: genre=${normalized} page=${pageNum} returned ${games.length}/${total}`)
            res.json({ genre: normalized, total, page: pageNum, totalPages: Math.ceil(total / limitNum), games })
        } catch (e) {
            console.error('getGamesByGenre error:', e.message)
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    async searchGames(req, res) {
        try {
            const q = (req.query.q || '').toString().trim()
            const limit = parseInt(req.query.limit, 10) || 20

            if (!q || q.length < 2) {
                return res.json([])
            }
            const games = await Game.find(
                { name: { $regex: q, $options: 'i' } },
                { _id: 0 }
            ).limit(limit)

            console.log(`searchGames: query="${q}" returned ${games.length} results`)
            return res.json(games)
        } catch (e) {
            console.error('searchGames error:', e.message)
            res.status(500).json({ error: 'Internal server error' })
        }
    }
}

export default new GameController