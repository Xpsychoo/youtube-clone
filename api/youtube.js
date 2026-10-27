// Vercel serverless function: GET /api/youtube?path=search/&q=...
const { fetchFromYoutube } = require('../server/youtubeProxy');

module.exports = async (req, res) => {
    const { status, body } = await fetchFromYoutube(req.query);
    res.status(status).json(body);
};
