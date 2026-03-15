import { getCachedGames } from '../middleware/cache.js'

class GameController {
    getAllGames(req, res) {
        const games = getCachedGames()
        res.json({
            total: games.length,
            games
        })
    }

    getGameById(req, res) {
        const { id } = req.query
        if (!id) {
            return res.status(400).json({ error: 'ID required' })
        }

        const gameId = parseInt(id)
        const games = getCachedGames()
        const game = games.find(game => game.sid === gameId)

        if (!game) {
            return res.status(404).json({ error: 'Game not found' })
        }

        res.json(game)
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

}

export default new GameController


