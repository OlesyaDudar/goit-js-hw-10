import { fetchBreeds, fetchCatByBreed } from './cat-api.js';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');
let arrOptions = [{ text: '', value: '', placeholder: true }];

error.style.display = 'none';

breedSelect.style.color = '#008000';
breedSelect.style.maxWidth = '400px';

catInfo.style.display = 'flex';
catInfo.style.gap = '20px';

fetchBreeds()
  .then(date => {
    date.forEach(element => {
      arrOptions.push({
        text: element.name,
        value: element.id,
        style: 'background-color: YellowGreen',
      });
    });
    new SlimSelect({
      select: breedSelect,
      data: arrOptions,
      settings: {
        allowDeselect: true,
      },
    });
    changeLoadingStatus();
  })
  .catch(err);

function err(err) {
  if (!arrOptions.placeholder.value) {
    Notify.failure('Oops! Something went wrong! Try reloading the page!');
    error.style.display = 'block';
  }
}

breedSelect.addEventListener('change', () => {
  changeUnLoadingStatus();
  const breedId = breedSelect.value;
  if (breedId !== '') {
    fetchCatByBreed(breedId)
      .then(data => {
        catInfo.innerHTML = `<div><img src="${data[0].url}" alt="${data[0].breeds[0].name}" width="400" /></div>
                <div><b><h2> ${data[0].breeds[0].name}</h2></b>
                <p> ${data[0].breeds[0].description}</p>
                <p><b>Temperament:</b> ${data[0].breeds[0].temperament}</p></div>
                
            `;
        changeLoadingStatus();
      })
      .catch(err);
  } else {
    changeLoadingStatus();
    catInfo.innerHTML = '';
  }
});

function changeLoadingStatus() {
  loader.classList.replace('loader', 'unloader');
}
function changeUnLoadingStatus() {
  loader.classList.replace('unloader', 'loader');
}
