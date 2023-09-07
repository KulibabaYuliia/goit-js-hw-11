// import axios from 'axios';
import { fetchBreeds, fetchCatByBreed } from './cat-api';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import Notiflix from 'notiflix';

const selectEL = document.querySelector('.breed-select');
const catInfo = document.querySelector('.cat-info');
const loaderEl = document.querySelector('.loader');

loaderEl.classList.add('visually-hidden');
catInfo.classList.add('visually-hidden');

fetchBreeds()
  .then(data => {
    selectEL.innerHTML = data
      .map(item => {
        return `<option value="${item.id}">${item.name}</option>`;
      })
      .join('');

    new SlimSelect({
      select: selectEL,
    });

    selectEL.classList.remove('visually-hidden');
  })
  .catch(function (error) {
    console.log(error);
    Notiflix.Notify.failure(
      `❌ Oops! Something went wrong! Try reloading the page!`
    );
  })
  .finally(() => {
    loaderEl.classList.add('visually-hidden');
  });

selectEL.addEventListener('change', e => {
  catInfo.innerHTML = '';

  fetchCatByBreed(e.currentTarget.value)
    .then(data => {
      createMarkup(data);
      catInfo.classList.remove('visually-hidden');
    })
    .catch(function (error) {
      console.log(error);
      Notiflix.Notify.failure(
        `❌ Oops! Something went wrong! Try reloading the page!`
      );
    })
    .finally(() => {
      loaderEl.classList.add('visually-hidden');
      selectEL.classList.remove('visually-hidden');
    });
});

function createMarkup(data) {
  const { breeds, url } = data;
  const { name, temperament, description } = breeds[0];

  catInfo.innerHTML = `<img src="${url}" alt="${name} width="200" height="300">
  <div class="text-container">
    <h2>${name}</h2>
      <p>${description}</p>
      <p><b>Temperament: </b>${temperament}</p></div>`;
}
