import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '31949883-7c5fe764cd95888a750d50db1';
export const PER_PAGE = 40;

const searchParams = new URLSearchParams({
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
});

export async function fetchPhotoApi(searchValue, page = 1) {
    // console.log(PER_PAGE)
    try {
        const response = await axios.get(
            `${BASE_URL}?key=${API_KEY}&q=${searchValue}&${searchParams}&page=${page}&per_page=${PER_PAGE}`
        );
        return response;
    } catch (error) {
        console.log(error);
    }
}