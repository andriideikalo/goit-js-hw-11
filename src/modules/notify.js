import { Notify } from 'notiflix/build/notiflix-notify-aio';

export const notifyFailure = () => {
    return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.', {
            timeout: 3000,
            width: '360px',
            svgSize: '120px',
            fontSize: '18px',
        }
    );
};

export const notifySuccess = totalHits => {
    return Notify.success(`Hooray! We found ${totalHits} images.`, {
        timeout: 3000,
        width: '360px',
        svgSize: '120px',
        fontSize: '18px',
    });
};

export const notifyInfoSearch = () => {
    return Notify.info('Please, fill out this field!', {
        timeout: 3000,
        width: '360px',
        svgSize: '120px',
        fontSize: '18px',
    });
};