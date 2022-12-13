import './sass/_styles.scss';

import { createMarkup } from './modules/markup';
import { PER_PAGE, fetchPhotoApi } from './modules/fetch';
// import SimpleLightbox from "simplelightbox";
import { simpleGallery } from './modules/simplelightbox';
import { notifyFailure, notifySuccess, notifyInfoSearch, } from './modules/notify';

const PER_PAGE = 40;

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const guard = document.querySelector('.js-guard');


let searchQuery = '';
let page = 1;
let totalHits = '';

searchForm.addEventListener('submit', onSearch);


function onSearch(evt) {
    evt.preventDefault();
    page = 1;
    observer.observe(refs.guard);
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
            console.log(guard)


            // if (data.totalHits === data.total) {
            //     return
            // }
            if (!totalHits) {
                return notifyFailure();
            }
            notifySuccess(totalHits);
            addMarkup(gallery.data.hits);
            simpleGallery.refresh();

            observer.observe(guard);
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
observer.observe(guard);

function onLoad(entries, observer) {
    entries.forEach(entry => {

        if (entry.isIntersecting) {
            page += 1;

            fetchPhotoApi(page)
                .then(data => {
                    gallery.insertAdjacentHTML('beforeend', createMarkup(arr));
                    // simpleGallery.refresh();

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

                    if (data.page === data.pages) {
                        observer.unobserve(guard);
                    }
                })



            .catch(error => {
                console.log(error);
            });

        }

    });
}

function createMarkup(arr) {
    return arr
        .map(
            ({
                webformatURL,
                largeImageURL,
                tags,
                likes,
                views,
                comments,
                downloads,
            }) =>
            `<a href="${largeImageURL}">
        <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div></a>`
        )
        .join('');
}