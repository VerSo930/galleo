import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../auth/auth.service';
import {DataStorageService} from '../storage/data-storage.service';
import {isNullOrUndefined} from 'util';
import {GalleryModel} from '../model/gallery.model';

@Component({
  selector: 'app-gallery-edit',
  templateUrl: './gallery-edit.component.html',
  styleUrls: ['./gallery-edit.component.css']
})
export class GalleryEditComponent implements OnInit, OnChanges {

  @Input()
  gallery: GalleryModel;
  @Output()
  status: EventEmitter<{ ok: boolean, message: string }> = new EventEmitter<{ ok: boolean, message: string }>();

  addGalleryForm: FormGroup;
  galleryList = [];

  isViewsReset = false;

  modal = {
    open: false,
    notification: {
      visible: false,
      ok: true,
      progress: 0,
      message: 'Please Choose a file'
    },
    loading: false
  };

  constructor(private storageService: DataStorageService,
              private authService: AuthService,
              private elem: ElementRef,
              private fb: FormBuilder) {}

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.dir(changes.photo.currentValue);
    if (!isNullOrUndefined(changes.photo.currentValue)) {
      if (isNullOrUndefined(this.addGalleryForm)) {
        this.createForm();
      }
      this.addGalleryForm.setValue(changes.photo.currentValue);
      console.dir(this.addGalleryForm.getRawValue());
    }
  }

  onViewsReset() {
    if (this.addGalleryForm.get('views').value === 0 && this.gallery.views !== 0) {
      this.isViewsReset = false;
      this.addGalleryForm.get('views').setValue(this.gallery.views);
    } else if (this.gallery.views !== 0) {
      this.isViewsReset = true;
      this.addGalleryForm.get('views').setValue(0);
    }

  }

  onViewsRestore() {
    this.addGalleryForm.get('views').setValue(this.gallery.views);
  }

  createForm() {
    this.addGalleryForm = this.fb.group({
      'id': [0],
      'userId': [0],
      'name': ['', [Validators.required]],
      'description': ['', [Validators.required]],
      'isPrivate': [false, [Validators.required]],
      'galleryId': [0, [Validators.required]],
      'createdAt': [],
      'updatedAt': [],
      'views': [],
      'url': []
    });
  }

  onSubmit() {
    this.onUploadStart();
    this.storageService.updateGallery(this.addGalleryForm.getRawValue()).subscribe((success: boolean) => {
      console.log('gallery update subscriber');
      if (success) {
        this.onEditSuccess();
      } else {
        this.onEditFailed();
        this.status.next({ok: false, message: 'An error occurred when updating photo'});
      }

    });
  }

  onUploadStart(): void {
    this.modal.notification.visible = true;
    this.modal.notification.message = 'Uploading...';
  }

  onEditSuccess(): void {
    this.modal.notification.message = 'Gallery updated!';
    setTimeout(() => {
      this.addGalleryForm.reset();
      this.status.next({ok: true, message: 'Gallery updated successfully'});
      this.modal.notification.ok = true;
      this.modal.loading = false;
      this.modal.notification.visible = false;
      this.modal.notification.progress = 0;
      this.dimissModal();
    }, 1000);
  }

  onEditFailed(): void {
    this.modal.notification.message = 'Gallery was not updated';
    setTimeout(() => {
      this.modal.loading = false;
      this.modal.notification.visible = false;
      this.modal.notification.ok = false;

      this.modal.notification.progress = 0;
    }, 1000);
  }

  dimissModal(): void {
    this.elem.nativeElement.querySelector('#dimissPhotoEditModal').click();
  }


}
