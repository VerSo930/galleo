import {Component, OnDestroy, OnInit} from '@angular/core';
import {SessionModel} from '../shared/model/session.model';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from '../auth/auth.service';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {


  session: SessionModel;
  authSubscription: Subscription = new Subscription();

  constructor(private authService: AuthService) { }

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
  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
  onLogout() {
    this.authService.logOut();
  }

}
