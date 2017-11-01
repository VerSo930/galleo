import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {PhotoModel} from '../model/photo.model';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';
import {DataStorageService} from '../storage/data-storage.service';
import {GalleryModel} from '../model/gallery.model';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'app-photo-list',
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.css'],
  animations: [
    trigger('divState',
      [
        transition(':enter', [
            query('img', style({opacity: 0, transform: 'translateX(-200px)'})),

            query('img', stagger('900ms', [
              animate('800ms 1.8s ease-out', style({opacity: 1, transform: 'translateX(0)'})),
            ])),

            query('img', [
              animate(1000, style('*'))
            ])

          ]
        ),
      transition(':leave', [
          query('img', style({opacity: 1, transform: 'translateX(0)'})),

          query('img', stagger('900ms', [
            animate('800ms 1.8s ease-out', style({opacity: 0, transform: 'translateX(-200px)'})),
          ]))

        ]
      )],
    )]
})

export class PhotoListComponent implements OnInit, OnChanges {

  @Input()
  gallery: GalleryModel;

  @Input()
  changeCover: boolean;

  selectedPhoto: PhotoModel;

  @Output()
  onScroll: EventEmitter<null> = new EventEmitter();

  @Output()
  photoSelected: EventEmitter<PhotoModel> = new EventEmitter();

  confirmationMessage = '';

  constructor(private dataStorage: DataStorageService,
              private elem: ElementRef) {  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!isNullOrUndefined(changes.changeCover)) {
      this.changeCover = changes.changeCover.currentValue;
      console.log('change cover click: ' + this.changeCover);
    }
  }

  onDialogConfirmation(confirmation: boolean) {

    if (confirmation && this.selectedPhoto != null && this.selectedPhoto.id !== 0) {
      console.log('confirm Dialog called');
      // this.onPhotoDelete(this.selectedPhoto);
      this.dataStorage.deletePhoto(this.selectedPhoto).subscribe(
        deleted => {
          console.log(deleted);

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
    this.onScroll.next(null);
  }

  onStatusMessage($event) {
    this.selectedPhoto = null;
    console.dir($event);
  }

}
