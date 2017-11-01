import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {DataStorageService} from '../storage/data-storage.service';
import {AuthService} from '../../auth/auth.service';
import {ProgressInterceptor} from '../interceptor/progress.interceptor';
import {isNullOrUndefined} from 'util';
import {PhotoModel} from '../model/photo.model';


@Component({
  selector: 'app-photo-edit',
  templateUrl: './photo-edit.component.html',
  styleUrls: ['./photo-edit.component.css']
})
export class EditPhotoComponent implements OnInit, OnChanges {

  @Input()
  photo: PhotoModel;
  @Output()
  status: EventEmitter<{ ok: boolean, message: string }> = new EventEmitter<{ ok: boolean, message: string }>();

  addPhotoForm: FormGroup;
  galleryList = [];

  isViewsReset = false;

  galleryListSubscription: Subscription;

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
   // this.photo = new PhotoModel();

    this.galleryListSubscription = this.storageService.galleryListChanged.subscribe(
      (galleryMap) => {
        this.galleryList = Array.from(galleryMap.values());
      }
    );
    this.storageService.getGalleryByUserId(this.authService.cachedSession.user.id, 1, 999);

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.dir(changes.photo.currentValue);
    if (!isNullOrUndefined(changes.photo.currentValue)) {
      if (isNullOrUndefined(this.addPhotoForm)) {
        this.createForm();
      }
      this.addPhotoForm.setValue(changes.photo.currentValue);
      console.dir(this.addPhotoForm.getRawValue());
    }
  }

  onViewsReset() {
    if (this.addPhotoForm.get('views').value === 0 && this.photo.views !== 0) {
      this.isViewsReset = false;
      this.addPhotoForm.get('views').setValue(this.photo.views);
    } else if (this.photo.views !== 0) {
      this.isViewsReset = true;
      this.addPhotoForm.get('views').setValue(0);
    }

  }

  onViewsRestore() {
    this.addPhotoForm.get('views').setValue(this.photo.views);
  }

  createForm() {
    this.addPhotoForm = this.fb.group({
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
    this.storageService.updatePhoto(this.photo, this.addPhotoForm.getRawValue()).subscribe((success: boolean) => {
      console.log('photo update subscriber');
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
    this.modal.notification.message = 'Photo updated!';
    setTimeout(() => {
      this.addPhotoForm.reset();
      this.status.next({ok: true, message: 'Image updated successfully'});
      this.modal.notification.ok = true;
      this.modal.loading = false;
      this.modal.notification.visible = false;
      this.modal.notification.progress = 0;
      this.dimissModal();
    }, 1000);
  }

  onEditFailed(): void {
    this.modal.notification.message = 'Image was not updated';
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
