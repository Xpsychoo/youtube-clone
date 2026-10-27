import axios from 'axios';

// Requests go through our own serverless function so the API key stays on the server.
// `url` looks like `search/?q=New` and is split into the endpoint path and its params.

// RapidAPI rate-limits aggressively, so space requests out, retry a 429 once,
// and cache responses for the session so revisiting a page costs nothing.
const MIN_GAP_MS = 350;
const cache = new Map();
let nextSlot = 0;

const waitForSlot = () => {
    const now = Date.now();
    const wait = Math.max(0, nextSlot - now);
    nextSlot = Math.max(now, nextSlot) + MIN_GAP_MS;
    return new Promise((resolve) => setTimeout(resolve, wait));
};

const request = async (params, retries = 1) => {
    await waitForSlot();
    try {
        const { data } = await axios.get('/api/youtube', { params });
        return data;
    } catch (error) {
        if (error?.response?.status === 429 && retries > 0) {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            return request(params, retries - 1);
        }
        throw error;
    }
};

export const getDataFromApi = (url) => {
    if (cache.has(url)) return cache.get(url);

    const [path, query = ''] = url.split('?');
    const params = { path, ...Object.fromEntries(new URLSearchParams(query)) };
    const promise = request(params);
    cache.set(url, promise);
    promise.catch(() => cache.delete(url));
    return promise;
}
