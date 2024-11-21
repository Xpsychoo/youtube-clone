import axios from 'axios';

const Base_url = 'https://youtube138.p.rapidapi.com'

const options = {
    params: { hl: 'en', gl: 'US' },
    headers: {
        'x-rapidapi-key': process.env.REACT_APP_YOUTUBE_API_KEY,
        'x-rapidapi-host': 'youtube138.p.rapidapi.com'
    }
};

export const getDataFromApi = async (url) => {
    const { data } = await axios.get(`${Base_url}/${url}`, options);
    return (data);
}
