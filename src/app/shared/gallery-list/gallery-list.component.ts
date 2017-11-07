import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GalleryModel} from '../model/gallery.model';
import {Router} from '@angular/router';
import {SessionModel} from '../model/session.model';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-gallery-list',
  templateUrl: './gallery-list.component.html',
  styleUrls: ['./gallery-list.component.css']
})
export class GalleryListComponent implements OnInit {

  @Input()
  galleryList: GalleryModel[];

  selectedGallery: GalleryModel;

  @Output()
  onScroll: EventEmitter<null> = new EventEmitter();

  session: SessionModel;

  constructor(private router: Router,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.session = this.authService.cachedSession;
  }

  onScrollMethod() {
    this.onScroll.next(null);
  }

  onViewDetails(gallery) {
    this.router.navigate(['./', 'view-profile', gallery.userId, 'gallery-detail', gallery.id]);
  }

  onUpdateSuccess($event) {
   console.log($event);
  }
  onGallerySelected(gallery: GalleryModel) {
    this.selectedGallery = gallery;
  }

  onGalleryDelete() {
// TODO: Modal lunch for confirmation of delete gallery
  }

}
