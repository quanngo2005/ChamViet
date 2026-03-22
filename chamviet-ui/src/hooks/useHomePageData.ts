import { HOME_COPY, HOME_IMAGES } from '../data/home';

export function useHomePageData() {
  // Static content exported as hook standard
  return {
    copy: HOME_COPY,
    images: HOME_IMAGES
  };
}
