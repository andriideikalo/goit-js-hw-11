import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '31949883-7c5fe764cd95888a750d50db1';
export const PER_PAGE = 40;

const searchParams = new URLSearchParams({
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
});

export const fetchPhotoApi = function(searchQuery, page, perPage) {
    return axios.get(
        `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}&`
    );
};