import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '31629453-3aa42bb9ff6dc8c3c3e379cd8';
export const PER_PAGE = 40;

const searchParams = new URLSearchParams({
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
});

export async function fetchPhotoApi(searchValue, page = 1) {
  try {
    const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${searchValue}&${searchParams}&page=${page}&per_page=${PER_PAGE}`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
}
