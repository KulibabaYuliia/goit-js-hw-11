import axios from 'axios';
import Notiflix from 'notiflix';

const BASE_URL = 'https://pixabay.com/api/';
const inputForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');

loadBtn.classList.add('visually-hidden');
let pageN = 1;
let totalPics;

const searchParams = new URLSearchParams({
  key: '39314249-b9f637c3b6d2b2c91ffe81f29',

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

inputForm.addEventListener('submit', e => {
  e.preventDefault();
  gallery.innerHTML = '';
  pageN = 1;
  searchParams.set('page', pageN);

  const { searchQuery } = e.currentTarget.elements;

  if (!searchQuery.value) {
    Notiflix.Notify.failure("Field search shouldn't be empty.");
    return;
  }

  searchParams.set('q', searchQuery.value);
  createMarkup();

  loadBtn.classList.remove('visually-hidden');
});

function createMarkup() {
  fetchPictures()
    .then(resp => {
      let cards = resp.hits
        .map(({ webformatURL, tags, likes, views, comments, downloads }) => {
          return `<div class="photo-card">
                    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                    <div class="info">
                      <p class="info-item">
                        <b>Likes: </b>${likes}
                      </p>
                      <p class="info-item">
                        <b>Views: </b>${views}
                      </p>
                      <p class="info-item">
                        <b>Comments: </b>${comments}
                      </p>
                      <p class="info-item">
                        <b>Downloads: </b>${downloads}
                      </p>
                    </div>
                  </div>`;
        })
        .join('');

      gallery.insertAdjacentHTML('beforeend', cards);

      totalPics = resp.totalHits;
    })
    .catch(error => console.log(error));
}

loadBtn.addEventListener('click', () => {
  pageN += 1;
  searchParams.set('page', pageN);

  let totalPages = totalPics / Number(searchParams.get('per_page'));
  if (pageN > totalPages) {
    loadBtn.classList.add('visually-hidden');
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }

  createMarkup();
});
