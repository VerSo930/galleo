import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {SessionModel} from '../../shared/model/session.model';
import {DataStorageService} from '../../shared/storage/data-storage.service';
import {Subscription} from 'rxjs/Subscription';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  session: SessionModel;
  authSubscription: Subscription = new Subscription();

  constructor(private authService: AuthService,
              private storageService: DataStorageService) { }

  ngOnInit() {
    this.session = this.authService.getSession();
    this.authSubscription = this.authService.session.subscribe(
      (sessionModel: SessionModel) => {
        if (!isNullOrUndefined(sessionModel)) {
          this.session = sessionModel;
        }
    }
    );
  }

   logout() {
     this.authService.logOut();
   }

   t() {
     this.authService.test();
   }
}
