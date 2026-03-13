import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const KEY = process.env.STEAM_API_KEY

app.get('/api/games', async (req, res) => {
    const apiUrl = `https://api.steampowered.com/IStoreService/GetAppList/v1/?key=${KEY}`
    // const apiUrl = 'https://store.steampowered.com/api/appdetails/?appids=3764200'
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(apiUrl, {
            signal: controller.signal,
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Node.js)' }
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Steam error: ${response.status}`);
        }

        const data = await response.json();
        res.json(data || { error: 'No data' });
    } catch (error) {
        if (error.name === 'AbortError') {
            return res.status(408).json({ error: 'Request timeout' });
        }
        res.status(500).json({ error: error.message });
    }
});



app.get('/api/getFileData', async (req, res) => {
    try {
        const filename = path.basename('steamDB.json');
        const raw = fs.readFileSync(filename, 'utf8');
        const games = JSON.parse(raw);

        res.json({
            total: games.length,
            games: games
        });
    } catch (err) {
        console.error('Файл steamDB.json не найден:', err.message);
    }
});



app.listen(4000, () => console.log('Server is running'));
