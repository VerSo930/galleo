import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataStorageService} from '../../shared/storage/data-storage.service';
import {GalleryModel} from '../../shared/model/gallery.model';
import {Subscription} from 'rxjs/Subscription';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';
import {AuthService} from '../../auth/auth.service';
import {PaginationModel} from '../../shared/model/pagination.model';
import {PhotoModel} from '../../shared/model/photo.model';
import {isNullOrUndefined} from 'util';
import {SessionModel} from '../../shared/model/session.model';


@Component({
  selector: 'app-gallery-detail',
  templateUrl: './gallery-detail.component.html',
  styleUrls: ['./gallery-detail.component.css'],
  animations: [
    trigger('divState',
      [
        transition('* => *', [
            query('img', style({opacity: 0, transform: 'translateX(-200px)'})),

            query('img', stagger('900ms', [
              animate('800ms 1.8s ease-out', style({opacity: 1, transform: 'translateX(0)'})),
            ])),

            query('img', [
              animate(1000, style('*'))
            ])

          ]
        )]
    )]
})

export class GalleryDetailComponent implements OnInit, OnDestroy, AfterViewInit {


  notification = {type: null, title: null, message: null, visible: false};
  gallery = new GalleryModel();

  @ViewChild('galleryHeader')
  galleryHeader: ElementRef;
  session: SessionModel;
  changeCover = false;

  private galleryListSubscription: Subscription;

  constructor(private storageService: DataStorageService,
              private route: ActivatedRoute,
              private authService: AuthService) {
  }

  ngAfterViewInit(): void {}

  ngOnInit() {

    this.session = this.authService.cachedSession;

    // reset pagination for storage service
    this.storageService.pagination = new PaginationModel(this.gallery.photosCount, 12, 1);
    this.gallery.id = +this.route.snapshot.params['galleryId'];

    /**
     * Subscribe to router changes and catch galleryId and userId from url parameters
     */
    this.route.params.subscribe(
      params => {
        this.gallery.id = +params['galleryId'];
      }
    );

    /**
     * Subscribe to changes that are made to gallery object ( updates, change etc)
     * @type {Subscription}
     */
    this.galleryListSubscription = this.storageService.galleryListChanged.subscribe(
      (galleryMap) => {
        this.gallery = galleryMap.get(this.gallery.id);
        this.setCoverImage(this.gallery.coverImage);
        console.dir(this.gallery);
      }
    );

    this.storageService.pagination = new PaginationModel(this.gallery.photosCount, 12, 1);
    this.storageService.getGalleryById(this.gallery.id);
  }

  onScroll() {


  }

  onCoverSelected(photo: PhotoModel) {
    this.changeCover = false;
    this.gallery.coverImage = photo;
    const updatedGallery = Object.assign(new GalleryModel(), this.gallery);
    updatedGallery.coverImage = photo;
    this.storageService.updateGallery(updatedGallery)
      .subscribe(
        (success) => {
          console.log(this.gallery);
          this.setCoverImage(photo);

        });
  }

  onChangeCoverClick() {
    this.changeCover = !this.changeCover;
  }

  setCoverImage(photo: PhotoModel) {
    if (isNullOrUndefined(photo)) {
      this.galleryHeader.nativeElement.style.backgroundImage = 'url(assets/img/bg3.jpg)';
      return;
    }
    this.galleryHeader.nativeElement.style.backgroundImage =
      'url(http://vuta-alexandru.com:8080/Galleo/photo/resource/'
      + photo.userId + '/' + photo.galleryId + '/' + photo.id + '/medium/' + photo.url + ')';
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


  ngOnDestroy(): void {
    this.galleryListSubscription.unsubscribe();
  }

}
