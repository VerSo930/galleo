export class PhotoModel {

  id: number;
  userId: number;
  galleryId: number;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  isPrivate: boolean;
  url: string;
  views: number;


  constructor() {
  }
}
