import axios from 'axios';
import Notiflix from 'notiflix';

import { BASE_URL } from './refs.js';

const searchParams = new URLSearchParams({
  key: '39314249-b9f637c3b6d2b2c91ffe81f29',
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
  page: 1,
});

async function fetchPictures() {
  const resp = await axios.get(`${BASE_URL}?${searchParams}`);

  if (resp.data.totalHits === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    throw new Error();
  }

  return resp.data;
}

export { searchParams, fetchPictures };
