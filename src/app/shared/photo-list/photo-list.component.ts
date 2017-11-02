import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {PhotoModel} from '../model/photo.model';
import {trigger, style, transition, animate, keyframes} from '@angular/animations';
import {DataStorageService} from '../storage/data-storage.service';
import {GalleryModel} from '../model/gallery.model';
import {isNullOrUndefined} from 'util';
import {PaginationModel} from '../model/pagination.model';
import {AuthService} from '../../auth/auth.service';
import {SessionModel} from '../model/session.model';

@Component({
  selector: 'app-photo-list',
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.css'],
  animations: [
    trigger('photo',
      [

        /*state('shown', style({ opacity: 1 })),
        state('hidden', style({ opacity: 0 })),*/
        // state('loaded', style({ opacity: 0 })),
        // state('unLoaded', style({ opacity: 0 })),
        transition(':enter', animate('800ms ease-in', keyframes(
          [
            style({opacity: 0, transform: 'scale(0)', offset: 0.1}),
            style({opacity: 0.5, transform: 'scale(0.5)', offset: 0.5}),
            style({opacity: 1, transform: 'scale(1)', offset: 1.0})
          ]
          ))
        ),
        transition(':leave', animate('800ms ease-in', keyframes([
          style({opacity: 1, transform: 'scale(1)', offset: 0.1}),
          style({opacity: 0.5, transform: 'scale(0.5)', offset: 0.5}),
          style({opacity: 0, transform: 'scale(0)', offset: 1.0})
        ]))),

        // transition('* =>loaded', animate('500ms ease-in', keyframes([
        //   style({opacity: 0, transform: 'scale(0.2)', offset: 0}),
        //   style({opacity: 0.3, transform: 'scale(0.7)',  offset: 0.3}),
        //   style({opacity: 1, transform: 'scale(1)',     offset: 1.0})
        // ]))),
        // transition(':leave', animate('300ms')),
        // transition('void <=> *', animate('600ms')),

        /* transition(':enter', [
             query('img', style({opacity: 0, transform: 'translateX(-300px)'})),

             query('img', stagger('900ms', [
               animate('800ms 1.8s ease-out', style({opacity: 1, transform: 'translateX(0)'})),
             ])),

             query('img', [
               animate(1000, style('*'))
             ])

           ]
         ),
 */
      ]
    )]
})

export class PhotoListComponent implements OnInit, OnChanges {

  @Input()
  gallery: GalleryModel;

  @Input()
  changeCover: boolean;

  photoState = 'unLoaded';

  selectedPhoto: PhotoModel;

  @Output()
  onScroll: EventEmitter<null> = new EventEmitter();

  @Output()
  photoSelected: EventEmitter<PhotoModel> = new EventEmitter();

  pagination = new PaginationModel(0, 12, 1);
  session: SessionModel;

  confirmationMessage = '';

  constructor(private storageService: DataStorageService,
              private elem: ElementRef,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.session = this.authService.cachedSession;
  }

  onImageLoad() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!isNullOrUndefined(changes.changeCover)) {
      this.changeCover = changes.changeCover.currentValue;
      console.log('change cover click: ' + this.changeCover);
    }

    if (changes.gallery) {
      this.pagination.totalCount = this.gallery.photosCount;
    }
  }

  onDialogConfirmation(confirmation: boolean) {

    if (confirmation && this.selectedPhoto != null && this.selectedPhoto.id !== 0) {
      console.log('confirm Dialog called');
      // this.onPhotoDelete(this.selectedPhoto);
      this.storageService.deletePhoto(this.selectedPhoto).subscribe(
        deleted => {
          console.log(deleted);
          this.pagination.totalCount--;
          this.elem.nativeElement.querySelector('#dimissConfirmationDialog').click();
          this.selectedPhoto = null;

        }
      );
    }
  }

  onPhotoDelete(photo: PhotoModel) {
    this.selectedPhoto = photo;
    this.confirmationMessage = 'Do you really want to delete this photo?';
  }

  onPhotoUpdate(photo: PhotoModel) {
    this.selectedPhoto = photo;
    setTimeout(() => this.elem.nativeElement.querySelector('#editPhotoModalButton').click(), 100);
  }

  onScrollMethod() {
    if (this.pagination.nextPage()) {
      this.storageService.getGalleryPhotos(this.gallery.id, this.pagination);
    }
  }

  onPhotoEdit($event) {
    this.selectedPhoto = null;
  }

  onPhotoAdd($event: { ok: boolean, message: string }) {
    if ($event.ok) {
      this.pagination.totalCount++;
    }
  }

}
