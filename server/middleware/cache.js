import fs from 'fs'
import path from 'path'

let cachedGames = null

export function initCache() {
    try {
        const filename = path.join(process.cwd(), 'steamDB.json')
        const raw = fs.readFileSync(filename, 'utf8')
        cachedGames = JSON.parse(raw)
        console.log(`Cash loaded: ${cachedGames.length} games`)
    } catch (err) {
        console.error('steamDB.json not found', err.message)
        cachedGames = []
    }
}

export function getCachedGames() {
    return cachedGames || []
}
