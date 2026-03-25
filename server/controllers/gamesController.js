import { getCachedGames } from '../middleware/cache.js'

class GameController {
    getAllGames(req, res) {
        const games = getCachedGames()
        res.json({
            total: games.length,
            games
        })
    }

    async getGameById(req, res) {
        const { id } = req.query
        if (!id) {
            return res.status(400).json({ error: 'ID required' })
        }

        const gameId = parseInt(id, 10)
        const games = getCachedGames()
        const game = games.find(game => game.sid === gameId)

        if (!game) {
            return res.status(404).json({ error: 'Game not found' })
        }

        const appid = game.sid
        const apiUrl = `https://store.steampowered.com/api/appdetails?appids=${appid}`

        try {
            const response = await fetch(apiUrl)
            if (!response.ok) {
                console.error('Steam API error status:', response.status)
                return res.json(game)
            }

            const data = await response.json()
            const appData = data[appid]?.data
            const success = data[appid]?.success

            if (success && appData) {
                game.screenshots = appData.screenshots || []
            }

            return res.json(game)
        } catch (e) {
            console.error('Steam fetch error:', e)
            return res.status(400).json(e)
        }
    }


    getTop20Games(req, res) {
        const games = getCachedGames()
            .sort((a, b) => (b.meta_score || 0) - (a.meta_score || 0))
            .slice(0, 20)
        res.json({
            total: games.length,
            games
        })
    }

    getGamesByGenre(req, res) {
        const { genre, page = '0' } = req.query
        if (!genre) {
            return res.status(400).json({ error: 'Genre required' })
        }

        const pageNum = parseInt(page) || 0
        const limitNum = 21

        const normalizedGenre = (genre).charAt(0).toUpperCase() +
            (genre).slice(1).toLowerCase()

        const allGames = getCachedGames()
            .filter(game => {
                if (!game.genres) return false

                const gameGenres = game.genres
                    .split(',')
                    .map(game => game.trim())
                    .map(game => game.charAt(0).toUpperCase() + game.slice(1).toLowerCase())

                return gameGenres.includes(normalizedGenre)
            })
            .sort((a, b) => (b.meta_score || 0) - (a.meta_score || 0))

        const total = allGames.length
        const games = allGames.slice(pageNum * limitNum, (pageNum + 1) * limitNum)

        res.json({
            genre: normalizedGenre,
            total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum),
            games
        })
    }

    searchGames(req, res) {
        try {
            const q = (req.query.q || '').toString().trim();
            const limit = parseInt(req.query.limit, 10) || 20;

            if (!q || q.length < 2) {
                return res.json([])
            }

            const qLower = q.toLowerCase();
            const games = getCachedGames()
                .filter(game => game.name && game.name.toLowerCase().includes(qLower))
                .slice(0, limit)


            return res.json(games)
        }
        catch (e) {
            console.error('Search error:', e)
            return res.status(400).json(e)
        }
    }

}

export default new GameController


