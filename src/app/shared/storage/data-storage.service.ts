import {Injectable} from '@angular/core';
import {GalleryModel} from '../model/gallery.model';
import {PhotoModel} from '../model/photo.model';
import {Subject} from 'rxjs/Subject';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppSettings} from '../../app.settings';
import {Observable} from 'rxjs/Observable';
import {HttpResponseModel} from '../model/http-response.model';
import {PaginationModel} from '../model/pagination.model';
import {AuthService} from '../../auth/auth.service';
import {isNullOrUndefined} from 'util';


@Injectable()
export class DataStorageService {

  galleryChanged = new Subject<GalleryModel>();
  galleryListChanged = new Subject<Map<number, GalleryModel>>();
  galleryMap = new Map<number, GalleryModel>();
  pagination = new PaginationModel(0, 12, 1);

  constructor(private httpClient: HttpClient,
              private authService: AuthService) {

  }


  addGallery(gallery: GalleryModel): Observable<GalleryModel> {
    console.dir(gallery);
    return this.httpClient.post<GalleryModel>(AppSettings.API_ENDPOINT + 'gallery/', gallery, {observe: 'response'}).map(
      (response) => {
        if (response.ok) {
          this.galleryMap.set(response.body.id, response.body);
          this.galleryListChanged.next(this.galleryMap);
          this.authService.cachedSession.user.galleriesCount++;
          return response.body;
        } else {
          return null;
        }
      },
      (error) => {
        return null;
      }
    );
  }

  getAllPhotos<T>(limit: number, page: number): Observable<HttpResponseModel<T>> {

    console.log('Get All photos called');
    const headers = new HttpHeaders()
      .set('X-Pagination-Page', '' + page)
      .set('X-Pagination-Limit', '' + limit);

    return this.httpClient.get<T>(AppSettings.API_ENDPOINT + 'photo',
      {observe: 'response', headers: headers}).map(
      (response) => {
        this.pagination.totalCount = +response.headers.get('X-Pagination-Count');
        this.pagination.currentPage = +response.headers.get('X-Pagination-Page');

        return new HttpResponseModel(response.body,
          +response.headers.get('X-Pagination-Page'),
          +response.headers.get('X-Pagination-Count'),
          response.ok,
          'Gallery data fetched succesfully');
      },
      (error) => {
        console.log(error);
        return new HttpResponseModel<T>(null,
          null,
          null,
          false,
          error.message);

      }
    );
  }

  /* getAllGalley(): void {
     this.httpClient.get<GalleryModel[]>(AppSettings.API_ENDPOINT + 'gallery/', {observe: 'response'}).subscribe(
       (response) => {
         this.galleryList = response.body;
         this.galleryListChanged.next(null);
         this.responseStatus.next({success: true, message: 'All gallery\'s fetched with success'});
       },
       (error) => {
         console.dir(error);
         this.responseStatus.next({success: false, message: 'Something goes wrong!'});
       }
     );
   }*/

  getGalleryById(id: number): void {
    console.log(':: Get gallery by id called');
    if (!this.galleryMap.has(id)) {
      this.httpClient.get<GalleryModel>(AppSettings.API_ENDPOINT + 'gallery/' + id, {observe: 'response'}).subscribe(
        (response) => {
          this.galleryMap.set(response.body.id, response.body);
          this.getGalleryPhotos(id, new PaginationModel(0, 12, 1));
          this.galleryListChanged.next(this.galleryMap);
        },
        (error) => {

        }
      );
    } else {
      if (this.galleryMap.get(id).photos == null || this.galleryMap.get(id).photos.length === 0) {
        console.log(':: Gallery photos are null.');
        this.getGalleryPhotos(id, new PaginationModel(0, 12, 1));
      }
      this.galleryListChanged.next(this.galleryMap);
    }

  }

  getGalleryByUserId(userId: number, page: number, limit: number): void {

    console.log(':: Get gallery by user id called');

    const headers = new HttpHeaders()
      .set('X-Pagination-Page', '' + page)
      .set('X-Pagination-Limit', '' + limit);

    this.httpClient.get<GalleryModel[]>(AppSettings.API_ENDPOINT + 'gallery/user/' + userId,
      {observe: 'response', headers: headers}).subscribe(
      (response) => {
        this.pagination.totalCount = +response.headers.get('X-Pagination-Count');
        this.pagination.currentPage = +response.headers.get('X-Pagination-Page');

        for (const gallery of response.body) {
          if (!this.galleryMap.has(+gallery.id)) {
            this.galleryMap.set(+gallery.id, gallery);
          }
        }
        console.dir(this.galleryMap);
        this.galleryListChanged.next(this.galleryMap);

      },
      (error) => {
        console.log(error);
        this.galleryListChanged.next(null);

      }
    );
  }

  updateGallery(gallery: GalleryModel) {
    return this.httpClient.put(AppSettings.API_ENDPOINT + 'gallery', gallery, {observe: 'response'}).map(
      (response) => {
          console.log('DataStorage image updated: ok');
          this.galleryMap.get(gallery.id).coverImage = gallery.coverImage;
          return true;

      },
      (error) => {
        console.log('DataStorage image updated: fail');
        return false;
      });
  }

  deleteGallery(galleryId: number) {

    this.httpClient.delete(AppSettings.API_ENDPOINT + 'gallery/' + galleryId, {observe: 'response'}).subscribe(
      (response) => {
        console.dir(response);

        if (this.galleryMap.has(galleryId)) {
          this.galleryMap.delete(galleryId);
        }

        this.galleryListChanged.next(this.galleryMap);
      },
      (error) => {
        console.dir(error);
      }
    );
  }

  deletePhoto(photo: PhotoModel): Observable<boolean> {
    return this.httpClient.delete(AppSettings.API_ENDPOINT + 'photo/' + photo.id, {observe: 'response'}).map(
      (response) => {
        console.log('DataStorage image deleted: ok');
        console.dir(this.galleryMap.get(photo.galleryId).photos);
        if (response.status === 200) {
          this.authService.cachedSession.user.photosCount--;
          const index = this.galleryMap.get(photo.galleryId).photos.findIndex(d => d.id === photo.id);
          this.galleryMap.get(photo.galleryId).photos.splice(index, 1);
                    console.dir(this.galleryMap.get(photo.galleryId).photos);
          this.galleryMap.get(photo.galleryId).photosCount--;
          // this.galleryChanged.next(this.galleryMap.get(photo.galleryId));
          this.galleryListChanged.next(this.galleryMap);
          return true;
        } else {
          return false;
        }
      },
      (error) => {
        console.log('DataStorage image delete: fail');
        return false;
      });
  }

  updatePhoto(originalPhoto: PhotoModel, updatedPhoto: PhotoModel): Observable<boolean> {
    return this.httpClient.put(AppSettings.API_ENDPOINT + 'photo/' + originalPhoto.galleryId, updatedPhoto,
      {observe: 'response'}).map(
      (response) => {
        const index = this.galleryMap.get(+originalPhoto.galleryId).photos.findIndex(d => +d.id === +originalPhoto.id);
        if (response.status === 200) {

          updatedPhoto.updatedAt = Date.now();
          // check if gallery id was changed ELSE
          // update photo in same gallery
          if (+originalPhoto.galleryId !== +updatedPhoto.galleryId) {

            // Remove photo from old gallery and update photo count
            this.galleryMap.get(+originalPhoto.galleryId).photos.splice(index, 1);
            this.galleryMap.get(+originalPhoto.galleryId).photosCount--;

            // Insert photo into new gallery and update photo count
            if (isNullOrUndefined(this.galleryMap.get(+updatedPhoto.galleryId).photos)) {
              this.galleryMap.get(+updatedPhoto.galleryId).photos = [];
            }
            this.galleryMap.get(+updatedPhoto.galleryId).photos.push(updatedPhoto);
            this.galleryMap.get(+updatedPhoto.galleryId).photosCount++;

          } else {
            // Update photo in same gallery at index position
            this.galleryMap.get(+updatedPhoto.galleryId).photos[index] = updatedPhoto;
          }

          // this.galleryListChanged.next(this.galleryMap);

          return true;
        } else {
          return false;
        }
      },
      (error) => {
        console.log('DataStorage image updated: fail');
        return false;
      });
  }

  getGalleryPhotos(galleryId: number, pagination: PaginationModel): void {

    console.log('Get gallery photos called');
    const headers = new HttpHeaders()
      .set('X-Pagination-Page', '' + pagination.currentPage)
      .set('X-Pagination-Limit', '' + pagination.limit);

    this.httpClient.get<PhotoModel[]>(AppSettings.API_ENDPOINT + 'photo/gallery/' + galleryId,
      {observe: 'response', headers: headers}).subscribe(
      (response) => {
        pagination.totalCount = +response.headers.get('X-Pagination-Count');
        pagination.currentPage = +response.headers.get('X-Pagination-Page');

        if (this.galleryMap.has(galleryId)) {
          if (this.galleryMap.get(galleryId).photos == null) {
            this.galleryMap.get(galleryId).photos = [];
          }
          this.galleryMap.get(galleryId).photos.push(...response.body);
        }
        this.galleryListChanged.next(this.galleryMap);
        console.dir(this.galleryMap.get(galleryId));

      },
      (error) => {
        console.log(error);
      }
    );
  }

  addPhoto(formData: any): Observable<PhotoModel> {
    console.log('Add photo called');
    console.dir(formData);
    return this.httpClient.post<PhotoModel>(AppSettings.API_ENDPOINT + 'photo/', formData, {
      observe: 'response',
      reportProgress: true
    }).map(
      (response) => {
        console.log('DataStorage image add: ok');
        const photo: PhotoModel = response.body;
        if (response.ok) {
          this.authService.cachedSession.user.photosCount++;
          this.galleryMap.get(photo.galleryId).photos.push(photo);
          this.galleryMap.get(photo.galleryId).photosCount++;
          this.galleryChanged.next(this.galleryMap.get(photo.galleryId));
          return response.body;
        } else {
          return null;
        }
      },
      (error) => {
        console.log('DataStorage image add: fail');
        return null;
      });

  }

}
