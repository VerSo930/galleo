import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GalleryModel} from '../model/gallery.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-gallery-list',
  templateUrl: './gallery-list.component.html',
  styleUrls: ['./gallery-list.component.css']
})
export class GalleryListComponent implements OnInit {

  @Input()
  galleryList: GalleryModel[];

  @Output()
  onScroll: EventEmitter<null> = new EventEmitter();

  constructor(private router: Router) { }

  ngOnInit() {

  }

  onScrollMethod() {
    this.onScroll.next(null);
  }

  onViewDetails(gallery) {
    this.router.navigate(['./', 'view-profile', gallery.userId, 'gallery-detail', gallery.id]);
}

}
