import { Notify } from 'notiflix/build/notiflix-notify-aio';

export const notifyFailure = () => {
  return Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
    {
      timeout: 1000,
    }
  );
};

export const notifySuccess = totalHits => {
  return Notify.success(`Hooray! We found ${totalHits} images.`, {
    timeout: 1000,
  });
};

export const notifyInfoSearch = () => {
  return Notify.info('Please, fill out this field!', { timeout: 1000 });
};
