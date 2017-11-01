import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataStorageService} from '../../shared/storage/data-storage.service';
import {UserModel} from '../../shared/model/user.model';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from '../../auth/auth.service';
import {PaginationModel} from '../../shared/model/pagination.model';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.css']
})
export class ProfileDetailComponent implements OnInit {

  user = new UserModel();
  galleryList = [];
  gallerySub: Subscription;
  sessionSub: Subscription;
  pagination: PaginationModel;

  notification = {
    type: null,
    title: null,
    message: null,
    visible: false
  };

  constructor(private route: ActivatedRoute,
              private router: Router,
              private storageService: DataStorageService,
              private authService: AuthService) { }

  ngOnInit() {

    // reset pagination for storage service
    this.pagination = new PaginationModel(0, 12, 1);

    this.route.parent.params.subscribe((params) => {
      this.user.id = params['id'];
    });

    this.sessionSub = this.authService.session.subscribe(
      (userSession) => {
        this.user = userSession.user;
      }
    );

    this.user = this.authService.getSession().user;

    this.gallerySub = this.storageService.galleryListChanged.subscribe(
        galleryMap => {
          this.galleryList = Array.from(galleryMap.values());
          },
        error => {  }
      );

    this.storageService.getGalleryByUserId(
      this.authService.getSession().user.id,
      1,
      15);

    // this.elem.nativeElement.querySelector('#test').src = this.src;

  }

  onViewDetails(id: number) {
    this.router.navigate(['gallery-detail', id], {relativeTo: this.route.parent});
  }

  onGalleryAdd(event: {ok: boolean, message: string}) {

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
}
