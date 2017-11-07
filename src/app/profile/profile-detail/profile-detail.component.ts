import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataStorageService} from '../../shared/storage/data-storage.service';
import {UserModel} from '../../shared/model/user.model';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from '../../auth/auth.service';
import {PaginationModel} from '../../shared/model/pagination.model';
import {isNullOrUndefined} from 'util';
import {GalleryModel} from '../../shared/model/gallery.model';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.css']
})
export class ProfileDetailComponent implements OnInit {

  user = new UserModel();
  galleryList = [];
  gallerySub: Subscription;
  pagination: PaginationModel;
  selectedGallery: GalleryModel;

  notification = {
    type: null,
    title: null,
    message: null,
    visible: false
  };

  constructor(private route: ActivatedRoute,
              private router: Router,
              private storageService: DataStorageService,
              private authService: AuthService) {
  }

  ngOnInit() {

    this.gallerySub = this.storageService.galleryListChanged.subscribe(
      galleryMap => {
        this.galleryList = Array.from(galleryMap.values()).filter(gallery => gallery.userId === this.user.id);
        console.dir(this.galleryList);
      },
      error => {
      }
    );

    // reset pagination for storage service
    this.pagination = new PaginationModel(0, 12, 1);

    this.route.parent.params.subscribe((params) => {
      this.user.id = params['userId'];
      this.authService.getUserById(this.user.id).subscribe(
        (user) => {
          if (!isNullOrUndefined(user)) {
            this.user = user;
            this.storageService.getGalleryByUserId(this.user.id, 1, 15);
          }
        }
      );
      console.log('userID: ' + this.user.id);
    });
  }

  onViewDetails(id: number) {
    this.router.navigate(['gallery-detail', id], {relativeTo: this.route.parent});
  }

  onGalleryAdd(event: { ok: boolean, message: string }) {

    if (event.ok) {
      this.showNotification('success', 'Success', event.message);
    } else {
      this.showNotification('error', 'Failed', event.message);
    }

    console.dir(event);

  }

  showNotification(type: string, title: string, message: string) {

    this.notification.type = type;
    this.notification.title = title;
    this.notification.message = message;
    this.notification.visible = true;

    setTimeout(() => {
      this.notification.visible = false;
    }, 5000);
  }

  onScroll() {

  }
  onEditClick() {

  }
  onEditSuccess($event) {

  }
}
