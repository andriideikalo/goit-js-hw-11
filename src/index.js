// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';
import { simpleGallery } from './modules/simplelightbox';
import Notiflix from 'notiflix';
import './sass/_styles.scss';
import { createMarkup } from './modules/markup';
import { fetchPhotoApi } from './modules/fetch';
import { notifyFailure } from './modules/notify';
import { notifySuccess } from './modules/notify';
import { notifyInfoSearch } from './modules/notify';


const { searchForm, imageGallery, guard } = {
    searchForm: document.querySelector('#search-form'),
    imageGallery: document.querySelector('.gallery'),
    guard: document.querySelector('.js-guard'),
};


const PER_PAGE = 40;
let page = 1;
let observer = null;
const options = {
    root: null,
    rootMargin: '600px',
    threshold: 1.0,
};

searchForm.addEventListener('submit', onSubmit);

function onSubmit(evt) {
    // console.log(evt)
    evt.preventDefault();
    imageGallery.innerHTML = '';
    if (page > 1) {
        observer.unobserve(guard);
    }
    page = 1;

    const searchQuery = evt.target.elements.searchQuery.value.trim();
    observer = new IntersectionObserver(onSearch, options);
    observer.observe(guard);

    function onSearch(entries, observer) {
        evt.preventDefault();
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                fetchPhotoApi(searchQuery, page, PER_PAGE)
                    .then(response => {
                        // console.log(response)
                        // console.log(page)
                        // console.log(response.data.hits.length)
                        if (response.data.hits.length < 1) {
                            throw new Error();
                        }
                        addMoreImages(response.data.hits);
                        if (page > 1) {

                            const { height: cardHeight } = document
                                .querySelector(".gallery")
                                .firstElementChild.getBoundingClientRect();

                            window.scrollBy({
                                top: cardHeight * 2,
                                behavior: "smooth",
                            });
                        }
                        if (page === 1) {
                            notifySuccess(response);
                        }
                        if (page === Math.ceil(response.data.totalHits / PER_PAGE)) {
                            observer.unobserve(guard);
                            window.addEventListener('scroll', checkScrollPosition);
                        }
                        page += 1;
                    })
                    .catch(error => {
                        notifyFailure();
                        observer.unobserve(guard);
                    })
                    .then(() => simpleGallery.refresh());
            }
        });
    }
}


function checkScrollPosition() {
    if (window.scrollY > window.innerHeight - 70) {
        window.removeEventListener('scroll', checkScrollPosition);
        notifyInfoSearch();
    }
}

function addMoreImages(arr) {
    imageGallery.insertAdjacentHTML('beforeend', createMarkup(arr));
}