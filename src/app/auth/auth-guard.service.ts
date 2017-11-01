import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/operator/take';
import {CookieService} from 'ngx-cookie';
import {SessionModel} from '../shared/model/session.model';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.dir(this.authService.getSession());

    if (!this.authService.getSession().isAuthenticated) {

     return this.authService.session.map((session: SessionModel) => {

       console.dir('AuthGuard: ' + session);
       if (session) {
         return true;
       } else {
         this.router.navigate(['signin']);
       }
     });

    } else {
      return true;
    }

  }





}
