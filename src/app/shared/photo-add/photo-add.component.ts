import {
  AfterViewInit,
  Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2,
  SimpleChanges, ViewChild
} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {DataStorageService} from '../storage/data-storage.service';
import {ProgressInterceptor} from '../interceptor/progress.interceptor';
import {AuthService} from '../../auth/auth.service';
declare var loadImage: any;
@Component({
  selector: 'app-photo-add',
  templateUrl: './photo-add.component.html',
  styleUrls: ['./photo-add.component.css']
})
export class PhotoAddComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input()
  galleryId: number;

  @Output()
  status: EventEmitter<{ ok: boolean, message: string }> = new EventEmitter<{ ok: boolean, message: string }>();

  @ViewChild('imagePreview')
  imagePreview: ElementRef;

  @ViewChild('test')
  test: ElementRef;

  @ViewChild('imageFile')
  imageFile: ElementRef;
  tmpImg: any;

  addPhotoForm: FormGroup;
  progressSubscription: Subscription;

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
              private httpProgress: ProgressInterceptor ) {}

  ngOnInit() {
    this.progressSubscription = this.httpProgress.progress$.subscribe(
      progress => {
        if (progress !== null) {
          this.modal.notification.progress = progress;
        }
      });
    this.createForm();
  }

  ngAfterViewInit(): void {
    console.dir(this.imagePreview.nativeElement);
  }

  createForm() {
    this.addPhotoForm = new FormGroup({
      'name': new FormControl('', [Validators.required, Validators.minLength(2)]),
      'description': new FormControl('', [Validators.required, Validators.minLength(10)]),
      'isPrivate': new FormControl(false, Validators.required),
      'image': new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    this.onUploadStart();
    console.dir(this.getFormData());
    this.storageService.addPhoto(this.getFormData()).subscribe((photo) => {
      console.dir(photo);
      if (photo != null) {
        this.onUploadSuccess();
      } else {
        this.onUploadFail();
        this.status.next({ok: false, message: 'Can \'t add image to the gallery'});
      }

    });
  }

  getFormData(): FormData {
    const formData = new FormData();
    formData.append('image', this.imageFile.nativeElement.files[0],
      this.imageFile.nativeElement.files[0].name);
    formData.append('name', this.addPhotoForm.get('name').value);
    formData.append('description', this.addPhotoForm.get('description').value);
    formData.append('isPrivate', this.addPhotoForm.get('isPrivate').value);
    formData.append('userId', '' + this.authService.getSession().user.id);
    formData.append('galleryId', '' + this.galleryId);

    return formData;
  }

  onCancel() {
    this.onImageClear();
    this.addPhotoForm.reset();
  }

  onImageClear(): void {
    this.imageFile.nativeElement.value = '';
    this.imagePreview.nativeElement.src = '';
  }

  imageChanged(): void {
    if (this.imageFile.nativeElement.files[0].type === 'image/jpeg' ||
      this.imageFile.nativeElement.files[0].type === 'image/png' ||
      this.imageFile.nativeElement.files[0].type === 'image/gif') {
      loadImage(
        this.imageFile.nativeElement.files[0],
        function (img) {
          this.imagePreview.nativeElement.src = img.toDataURL();
          console.dir(img);
        }.bind(this),
        {orientation: true,
          maxWidth: 600,
          maxHeight: 300,
          minWidth: 100,
          minHeight: 50,
          canvas: true}
      );

      // read image data and set it to src
      const myReader: FileReader = new FileReader();
      myReader.onloadend = () => {


      };

      myReader.readAsDataURL(this.imageFile.nativeElement.files[0]);
      this.modal.notification.visible = false;
    } else {
      this.modal.notification.visible = true;
      this.modal.notification.message = 'Image type not accepted! Try with an image';
    }
  }

  onUploadStart(): void {
    this.modal.notification.visible = true;
    this.modal.notification.progress = 0;
    this.modal.notification.message = 'Uploading...';
  }

  onUploadSuccess(): void {
    this.modal.notification.message = 'Upload Finished!';
    setTimeout(() => {
      this.addPhotoForm.reset();
      this.status.next({ok: true, message: 'Image Added to the gallery'});
      this.modal.notification.ok = true;
      this.modal.loading = false;
      this.modal.notification.visible = false;
      this.modal.notification.progress = 0;
      this.onImageClear();
      this.dimissAddPhotoModal();
    }, 2000);
  }

  onUploadFail(): void {
    this.modal.notification.message = 'Upload Failed!';
    setTimeout(() => {
      this.modal.loading = false;
      this.modal.notification.visible = false;
      this.modal.notification.ok = false;

      this.modal.notification.progress = 0;
      this.onImageClear();
    }, 2000);
  }

  dimissAddPhotoModal(): void {
    this.elem.nativeElement.querySelector('#dimissModal').click();
  }

  ngOnDestroy(): void {
    this.progressSubscription.unsubscribe();
  }

  removeExif(imageArrayBuffer, dv) {
    let offset = 0, recess = 0;
    const pieces = [];
    let i = 0;
    if (dv.getUint16(offset) === 0xffd8) {
      offset += 2;
      let app1 = dv.getUint16(offset);
      offset += 2;
      while (offset < dv.byteLength) {
        if (app1 === 0xffe1) {
          pieces[i] = {recess: recess, offset: offset - 2};
          recess = offset + dv.getUint16(offset);
          i++;
        } else if (app1 === 0xffda) {
          break;
        }
        offset += dv.getUint16(offset);
        app1 = dv.getUint16(offset);
        offset += 2;
      }
      if (pieces.length > 0) {
        const newPieces = [];
        pieces.forEach(function (v) {
          newPieces.push(imageArrayBuffer.slice(v.recess, v.offset));
        }, this);
        newPieces.push(imageArrayBuffer.slice(recess));
        const br = new Blob(newPieces, {type: 'image/jpeg'});
        return URL.createObjectURL(br);
      }
    }
  }


}
