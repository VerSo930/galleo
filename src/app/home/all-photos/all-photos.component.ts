import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataStorageService} from '../../shared/storage/data-storage.service';
import {PhotoModel} from '../../shared/model/photo.model';
import {Subscription} from 'rxjs/Subscription';
import {GalleryModel} from '../../shared/model/gallery.model';

@Component({
  selector: 'app-all-photos',
  templateUrl: './all-photos.component.html',
  styleUrls: ['./all-photos.component.css']
})
export class AllPhotosComponent implements OnInit, OnDestroy {

  gallery = new GalleryModel();
  subscription: Subscription;
  constructor(private storageService: DataStorageService) { }

  ngOnInit() {

    this.subscription = this.storageService.getAllPhotos<PhotoModel[]>(10, 1).subscribe(
      response => {
        console.dir(response);
        if (response.ok) {
          this.gallery = new GalleryModel();
          this.gallery.photos = response.data;
        }
      }
    );

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onScroll($event) {
  }

}
