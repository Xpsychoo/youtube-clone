import axios from 'axios';

// Requests go through our own serverless function so the API key stays on the server.
// `url` looks like `search/?q=New` and is split into the endpoint path and its params.
export const getDataFromApi = async (url) => {
    const [path, query = ''] = url.split('?');
    const params = { path, ...Object.fromEntries(new URLSearchParams(query)) };
    const { data } = await axios.get('/api/youtube', { params });
    return (data);
}
