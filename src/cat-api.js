import axios from 'axios';

const URL = 'https://api.thecatapi.com/v1/';
const API_KEY =
  'live_Bvxr70bTTfDKQbg35tIo0Y1eEOEnV2VJHN1Ind74KHnHxmimCSWLYgp6mla1QdkD';
axios.defaults.headers.common['x-api-key'] = API_KEY;

const selectEL = document.querySelector('.breed-select');
const loaderEl = document.querySelector('.loader');
const catInfo = document.querySelector('.cat-info');

export function fetchBreeds() {
  loaderEl.classList.remove('visually-hidden');
  selectEL.classList.add('visually-hidden');

  return axios.get(`${URL}breeds`).then(function (response) {
    if (response.status !== 200) {
      throw new Error(response.status);
    }

    return response.data;
  });
}

export function fetchCatByBreed(breedId) {
  loaderEl.classList.remove('visually-hidden');
  catInfo.classList.add('visually-hidden');

  return axios
    .get(`${URL}images/search?breed_ids=${breedId}`)
    .then(function (response) {
      if (response.status !== 200) {
        throw new Error(res.status);
      }

      return response.data[0];
    });
}
