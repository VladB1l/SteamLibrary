import express from 'express'
import GameController from '../controllers/gamesController.js'

const router = express.Router()
const gameController = GameController

router.get('/top20', gameController.getTop20Games)
router.get('/game', gameController.getGameById)
router.get('/genre', gameController.getGamesByGenre)
router.get('/search', gameController.searchGames)
router.get('/games', gameController.getAllGames)

export default router
