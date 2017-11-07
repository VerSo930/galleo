import {PhotoModel} from './photo.model';
import {SessionModel} from './session.model';

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

  filterPrivatePhotos(session: SessionModel): void {
    this.photos = this.photos.filter((el: PhotoModel) => {
      if (el.isPrivate) {
        return session.isAuthenticated && session.user.id === this.userId;
      } else {
        return true;
      }
    });
  }


}
