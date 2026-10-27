// Netlify function, exposed as /api/youtube via netlify.toml
const { fetchFromYoutube } = require('../../server/youtubeProxy');

exports.handler = async (event) => {
    const { status, body } = await fetchFromYoutube(event.queryStringParameters);
    return {
        statusCode: status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    };
};
