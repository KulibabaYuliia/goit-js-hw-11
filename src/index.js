import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { inputForm, gallery, target } from './js/refs.js';
import { searchParams, fetchPictures } from './js/pixabayapi.js';

let currentPage = 1;
let totalPics;

let options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};
let observer = new IntersectionObserver(onLoad, options);

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  loop: false,
});

inputForm.addEventListener('submit', e => {
  e.preventDefault();
  gallery.innerHTML = '';
  currentPage = 1;
  searchParams.set('page', currentPage);

  const { searchQuery } = e.currentTarget.elements;

  if (!searchQuery.value) {
    Notiflix.Notify.failure("Field search shouldn't be empty.");
    return;
  }

  searchParams.set('q', searchQuery.value);
  createMarkup();

  observer.observe(target);

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
                        <b>Likes:</b><span>${likes}</span>
                      </p>
                      <p class="info-item">
                        <b>Views:</b><span>${views}</span>
                      </p>
                      <p class="info-item">
                        <b>Comments:</b><span>${comments}</span>
                      </p>
                      <p class="info-item">
                        <b>Downloads:</b><span>${downloads}</span>
                      </p>
                    </div>
                  </div>`;
          }
        )
        .join('');

      gallery.insertAdjacentHTML('beforeend', cards);

      totalPics = resp.totalHits;
    })
    .catch(error => console.log(error))
    .finally(() => {
      lightbox.refresh();
    });
}

function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      currentPage += 1;
      searchParams.set('page', currentPage);

      createMarkup();

      let totalPages = totalPics / Number(searchParams.get('per_page'));
      if (currentPage > totalPages) {
        observer.unobserve(target);
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
    }
  });
}
