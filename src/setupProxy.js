// Serves /api/youtube during `npm start`, using YOUTUBE_API_KEY from .env
const { fetchFromYoutube } = require('../server/youtubeProxy');

module.exports = (app) => {
    app.get('/api/youtube', async (req, res) => {
        const { status, body } = await fetchFromYoutube(req.query);
        res.status(status).json(body);
    });
};
