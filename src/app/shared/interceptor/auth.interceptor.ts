import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {Injectable, Injector} from '@angular/core';

import { AuthService } from '../../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService: AuthService;
  constructor(private injector: Injector) {  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // If login method called skip and continue request
    if (req.url.includes('login')) {
      return next.handle(req);
    }

    // If request don't have the Authorization Header, add the token to the header
    if (!req.headers.has('Authorization')) {
      this.authService = this.injector.get(AuthService);
      const request = req.clone({
        setHeaders: {
          Authorization: `${this.authService.getSession().token}`
        }
      });
      return next.handle(request);
    }
    return next.handle(req);
  }
}
