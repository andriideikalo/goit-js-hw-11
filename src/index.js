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
console.log(refs.gallery)

let searchQuery = '';
let page = 1;
let totalHits = '';

refs.searchForm.addEventListener('submit', onSearch);
// window.addEventListener('scroll', checkPosition)


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
    console.log(totalHits)
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
                    console.log(simpleGallery.refresh())
                    const { height: cardHeight } = document
                        .querySelector(".gallery")
                        .firstElementChild.getBoundingClientRect();

                    window.scrollBy({
                        top: cardHeight * 2,
                        behavior: "smooth",
                    });
                })
                .catch(error => {
                    console.log(error);
                });

            if (response.data.total === response.data.totalHits) {
                notifySuccess(totalHits);
                return;
            }

        }



    });
}

// function checkPosition() {
//     if (window.scrollY > window.innerHeight - 70) {
//         window.removeEventListener('scroll', checkPosition);
//         notifyInfo();
//         return
//     }
// }

// function onLoad(entries, observer) {
//     entries.forEach(entry => {
//         if (entry.isIntersecting) {
//             applicateAPI(searchQuery, page, perPage)
//                 .then(response => {
//                     if (response.data.hits.length < 1) {
//                         throw new Error();
//                     }
//                     addMoreImages(response.data.hits);
//                     if (page > 1) {
//                         smoothImagesScroll();
//                     }
//                     if (page === 1) {
//                         notifySuccess(response);
//                     }
//                     if (page === Math.ceil(response.data.totalHits / perPage)) {
//                         observer.unobserve(guard);
//                         window.addEventListener('scroll', checkScrollPosition);
//                     }
//                     changeFormOpacity();
//                     page += 1;
//                 })
//                 .catch(error => {
//                     notifyFailure();
//                     observer.unobserve(guard);
//                 })
//                 .then(() => simpleligthbox.refresh());
//         }
//     });
// }
// }