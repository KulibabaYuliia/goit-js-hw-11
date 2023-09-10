import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { inputForm, gallery, loadBtn } from './js/refs.js';
import { searchParams, fetchPictures } from './js/pixabayapi.js';

loadBtn.classList.add('visually-hidden');
let pageN = 1;
let totalPics;

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  loop: false,
});

inputForm.addEventListener('submit', e => {
  e.preventDefault();
  gallery.innerHTML = '';
  pageN = 1;
  searchParams.set('page', pageN);
  loadBtn.classList.add('visually-hidden');

  const { searchQuery } = e.currentTarget.elements;

  if (!searchQuery.value) {
    Notiflix.Notify.failure("Field search shouldn't be empty.");
    return;
  }

  searchParams.set('q', searchQuery.value);
  createMarkup();

  setTimeout(() => {
    Notiflix.Notify.success(`Hooray! We found ${totalPics} images.`);
  }, 1000);
});

function createMarkup() {
  fetchPictures()
    .then(resp => {
      let cards = resp.hits
        .map(
          ({
            webformatURL,
            tags,
            likes,
            views,
            comments,
            downloads,
            largeImageURL,
          }) => {
            return `<div class="photo-card">
                    <a href="${largeImageURL}">
                      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                    </a>
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
          }
        )
        .join('');

      gallery.insertAdjacentHTML('beforeend', cards);

      totalPics = resp.totalHits;
      loadBtn.classList.remove('visually-hidden');
    })
    .catch(error => console.log(error))
    .finally(() => {
      lightbox.refresh();
    });
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
