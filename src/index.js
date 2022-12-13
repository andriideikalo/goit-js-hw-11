import './sass/_styles.scss';

import { createMarkup } from './modules/markup';
import { PER_PAGE, fetchPhotoApi } from './modules/fetch';
// import SimpleLightbox from "simplelightbox";
import { simpleGallery } from './modules/simplelightbox';
import { notifyFailure, notifySuccess, notifyInfoSearch, } from './modules/notify';


const refs = {
    searchForm: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    guard: document.querySelector('.js-guard'),
};

let searchQuery = '';
let page = 1;
let totalHits = '';

refs.searchForm.addEventListener('submit', onSearch);


async function onSearch(evt) {
    evt.preventDefault();
    page = 1;
    observer.unobserve(refs.guard);
    searchQuery = evt.currentTarget.searchQuery.value.trim();
    refs.gallery.innerHTML = '';
    evt.currentTarget.reset();

    if (!searchQuery) {
        refs.gallery.innerHTML = '';
        notifyInfoSearch();
        return;
    }

    await fetchPhotoApi(searchQuery, page)
        .then(gallery => {
            totalHits = gallery.data.totalHits;

            if (!totalHits) {
                return notifyFailure();
            }
            notifySuccess(totalHits);
            addMarkup(gallery.data.hits);
            simpleGallery.refresh();

            observer.observe(refs.guard);
        })
        .catch(error => console.log(error));
}

function addMarkup(arr) {
    refs.gallery.insertAdjacentHTML('beforeend', createMarkup(arr));
}

const options = {
    root: null,
    rootMargin: '200px',
    threshold: 1.0,
};

const observer = new IntersectionObserver(onLoad, options);

async function onLoad(entries, observer) {
    await entries.forEach(entry => {
        if (entry.isIntersecting) {
            page += 1;

            fetchPhotoApi(searchQuery, page)
                .then(gallery => {
                    addMarkup(gallery.data.hits);
                    simpleGallery.refresh();
                })
                .catch(error => {
                    console.log(error);
                });
            if (page === Math.round(totalHits / PER_PAGE)) {
                observer.unobserve(refs.guard);
                page = 1;
            }
        }
    });
}