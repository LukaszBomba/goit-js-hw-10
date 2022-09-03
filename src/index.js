import './css/styles.css';

import { fetchCountries } from './fetchCountries';

import Notiflix from 'notiflix';

import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const inputCountry = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

document.body.style.backgroundColor = '#f1f2f3';

const clear = () => {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
};

const searchCountry = event => {
  const findCountry = event.target.value.trim();
  if (!findCountry) {
    clear();
    return;
  }

  fetchCountries(findCountry)
    .then(country => {
      if (country.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        clear();
        return;
      } else if (country.length === 1) {
        clear(countryList.innerHTML);
        renderCountryInfo(country);
      } else if (country.length > 1 && country.length <= 10) {
        clear(countryInfo.innerHTML);
        renderCountryList(country);
      }
    })

    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      clear();
      return error;
    });
};

const renderCountryList = country => {
  const elementShow = country
    .map(({ name, flags }) => {
      return `
      <li>
      <img src="${flags.svg}" alt="${name.official}" width="200" height="120">
      <p><b>${name.official}</b></p>
      </li>`;
    })
    .join('');

  countryList.innerHTML = elementShow;
};

const renderCountryInfo = country => {
  const elementShow = country
    .map(({ name, capital, population, flags, languages }) => {
      return `<section>
        
      <h1>
      <img src="${flags.svg}" alt="${name.official}"width="200" height="120"> ${
        name.official
      }
      </h1>
      
      <p><b>Capital:</b>  ${capital} </p>

      <p><b>Population:</b> ${population}</p>

      <p><b>Languages:</b> ${Object.values(languages)}</p><section>`;
    })
    .join('');

  countryInfo.innerHTML = elementShow;
};

inputCountry.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));
