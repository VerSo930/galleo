import {Component, Inject, OnInit} from '@angular/core';
import {UserModel} from '../shared/model/user.model';
import {AuthService} from '../auth/auth.service';
import {DOCUMENT} from '@angular/common';
import {DataStorageService} from '../shared/storage/data-storage.service';
import {Subscription} from 'rxjs/Subscription';
import {GalleryModel} from '../shared/model/gallery.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user = new UserModel();

  constructor(private authService: AuthService,
              private route: ActivatedRoute,
              private storageService: DataStorageService,
              @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {

    /**
     * Subscribe to router changes and catch galleryId and userId from url parameters
     */
    this.route.params.subscribe(
      params => {
        this.user.id = +params['userId'];
        console.log('Profile: router userId:' + this.user.id);
      }
    );

    this.user = this.authService.getSession().user;
    this.document.body.removeAttribute('class');
    this.document.body.classList.add('profile-page');
    this.document.body.classList.add('sidebar-collapse');



  }


}
