import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

const STEAM_API_KEY = process.env.STEAM_API_KEY;

export async function getSteamProfile(req, res) {
    try {
        const { steamId } = req.body;

        if (!steamId) {
            return res.status(400).json({ error: 'SteamID required' });
        }

        console.log(STEAM_API_KEY)
        const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/` +
            `?key=${STEAM_API_KEY}&steamids=${steamId}`;

        const profileRes = await axios.get(url);
        const profile = profileRes.data.response.players[0];

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        const userData = {
            steamId: profile.steamid,
            name: profile.personaname,
            avatar: profile.avatarfull || profile.avatar,
            balance: 0.00,
            isActive: true
        };

        res.json({ success: true, user: userData });

    } catch (error) {
        console.error('Steam API full error:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        res.status(500).json({ error: 'Steam API failed' });
    }
}
