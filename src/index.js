import './sass/_styles.scss';

import { createMarkup } from './modules/markup';
import { PER_PAGE, fetchPhotoApi } from './modules/fetch';
// import SimpleLightbox from "simplelightbox";
import { simpleGallery } from './modules/simplelightbox';
import { notifyFailure, notifySuccess, notifyInfoSearch, } from './modules/notify';

const PER_PAGE = 40;
const refs = {
    searchForm: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    guard: document.querySelector('.js-guard'),
};

let searchQuery = '';
let page = 1;
let totalHits = '';

refs.searchForm.addEventListener('submit', onSearch);


function onSearch(evt) {
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

    fetchPhotoApi(searchQuery, page)
        .then(gallery => {
            totalHits = gallery.data.totalHits;
            console.log(totalHits)
            console.log(refs.guard)


            // if (data.totalHits === data.total) {
            //     return
            // }
            if (!totalHits) {
                return notifyFailure();
            }
            notifySuccess(totalHits);
            addMarkup(gallery.data.hits);
            simpleGallery.refresh();

            observer.observe(refs.guard);
            console.log(gallery);
            console.log(page);
            console.log(totalHits);
            console.log(Math.ceil(totalHits / PER_PAGE));

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
window.addEventListener('scroll', options)
const observer = new IntersectionObserver(onLoad, options);

function onLoad(entries, observer) {
    entries.forEach(entry => {

        if (entry.isIntersecting) {
            page += 1;

            fetchPhotoApi(searchQuery, page)
                .then(gallery => {
                    addMarkup(gallery.data.hits);
                    simpleGallery.refresh();

                    // const { height: cardHeight } = document
                    //     .querySelector(".gallery")
                    //     .firstElementChild.getBoundingClientRect();

                    // window.scrollBy({
                    //     top: cardHeight * 2,
                    //     behavior: "smooth",
                    // });
                    // console.log(gallery);
                    // console.log(page);
                    // console.log(totalHits);
                    // console.log(Math.ceil(totalHits / PER_PAGE));

                    if (page === Math.ceil(totalHits / PER_PAGE)) {
                        observer.unobserve(refs.guard);
                    }
                })



            .catch(error => {
                console.log(error);
            });

        }

    });
}

function checkScrollPosition() {
    if (window.scrollY > window.innerHeight - 70) {
        window.removeEventListener('scroll', checkScrollPosition);
        notifyInfo();
    }
}

function notifyInfo() {
    Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results"
    );
}