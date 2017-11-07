import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataStorageService} from '../../shared/storage/data-storage.service';
import {Subscription} from 'rxjs/Subscription';
import {GalleryModel} from '../../shared/model/gallery.model';
import {PaginationModel} from '../../shared/model/pagination.model';
import {isNullOrUndefined} from 'util';


@Component({
  selector: 'app-all-photos',
  templateUrl: './all-photos.component.html',
  styleUrls: ['./all-photos.component.css']
})
export class AllPhotosComponent implements OnInit, OnDestroy {

  gallery = new GalleryModel();
  constructor(private storageService: DataStorageService) { }

  ngOnInit() {

  this.storageService.getAllPhotos(new PaginationModel(0, 12, 1)).subscribe(
      response => {
        if (response.ok && response.body.length !== 0) {
          this.gallery = new GalleryModel();
          this.gallery.photosCount = +response.headers.get('X-Pagination-Count');
          this.gallery.photos = response.body;
          console.log('get all photos subscribe');
          console.dir(this.gallery);
        }
      }
    );

  }

  ngOnDestroy(): void {
  }

  onScroll($event) {
  }

}
