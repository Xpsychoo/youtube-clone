// Shared by the Vercel function, the Netlify function and the local dev server.
// The API key only ever lives on the server, never in the browser bundle.
const BASE_URL = 'https://youtube138.p.rapidapi.com';
const ALLOWED_PATHS = [
    'search/',
    'auto-complete/',
    'video/details/',
    'video/related-contents/',
    'video/comments/',
    'channel/details/',
    'channel/videos/',
    'playlist/details/',
    'playlist/videos/',
];

const fetchFromYoutube = async (query = {}) => {
    const { path, ...params } = query;

    if (!ALLOWED_PATHS.includes(path)) {
        return { status: 400, body: { error: 'Invalid path' } };
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
        return { status: 500, body: { error: 'YOUTUBE_API_KEY is not set' } };
    }

    const search = new URLSearchParams({ hl: 'en', gl: 'US', ...params });
    try {
        const response = await fetch(`${BASE_URL}/${path}?${search}`, {
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': 'youtube138.p.rapidapi.com',
            },
        });
        const body = await response.json();
        return { status: response.status, body };
    } catch (error) {
        return { status: 502, body: { error: 'Failed to reach YouTube API' } };
    }
};

module.exports = { fetchFromYoutube };
