import {PhotoModel} from './photo.model';

export class GalleryModel {

  id: number;
  userId: number;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  isPrivate: boolean;
  photos: PhotoModel[];
  coverImage: PhotoModel;
  photosCount = 0;
  views = 0;

  constructor() {

  }


}
