import {Component, ElementRef, EventEmitter, OnInit, Output} from '@angular/core';
import {GalleryModel} from '../model/gallery.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../auth/auth.service';
import {DataStorageService} from '../storage/data-storage.service';

@Component({
  selector: 'app-gallery-add',
  templateUrl: './gallery-add.component.html',
  styleUrls: ['./gallery-add.component.css']
})
export class GalleryAddComponent implements OnInit {

  @Output()
  status: EventEmitter<{ ok: boolean, message: string }> = new EventEmitter<{ ok: boolean, message: string }>();

  form: FormGroup;

  modal = {
    open: false,
    notification: {
      visible: false,
      message: ''
    },
    loading: false
  };

  constructor(private authService: AuthService,
              private elem: ElementRef,
              private storageService: DataStorageService) { }

  ngOnInit() {
    this.createForm();
  }

  onSubmit() {
    const gallery = new GalleryModel();
    gallery.userId = this.authService.getSession().user.id;
    gallery.name = this.form.get('name').value;
    gallery.description = this.form.get('description').value;
    gallery.isPrivate = this.form.get('isPrivate').value;

    this.modal.loading = true;

   this.storageService.addGallery(gallery).subscribe((r) => {
      this.modal.loading = false;
      if (r == null) {
        this.modal.notification.visible = true;
        this.modal.notification.message = 'Sorry... gallery not created! Try again';
      } else {
        this.status.next({ok: true, message: 'Gallery Added successfully'});
        this.modal.notification.visible = false;
        this.form.reset();
        this.dimissModal();
      }
    });

  }

  dimissModal() {
    this.elem.nativeElement.querySelector('#dimissModal').click();
  }

  createForm() {
    this.form = new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'description':  new FormControl('', Validators.required),
      'isPrivate':  new FormControl(false, Validators.required)
    });
  }
}
