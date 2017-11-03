
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {UserModel} from '../shared/model/user.model';
import {CookieService} from 'ngx-cookie';
import 'rxjs/add/observable/of';
import {SessionModel} from '../shared/model/session.model';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppSettings} from '../app.settings';
import {Md5} from 'ts-md5/dist/md5';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';


@Injectable()
export class AuthService {

  public session: Subject<SessionModel> = new Subject<SessionModel>();
  public cachedSession: SessionModel = new SessionModel('', new UserModel(), false);
  private apiUrl = 'http://vuta-alexandru.com:8080/Galleo/user/login';

   constructor(private cookieSrv: CookieService,
              private router: Router,
              private http: HttpClient) {
     this.loginByCookie();
  }

  // login method, call REST API and store cookie into user Browser
  login(username: string, password: string) {

    const user: UserModel = new UserModel();
    user.userName = username;
    user.password = Md5.hashStr(password).toString();

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

     return this.http.post<UserModel>(this.apiUrl, user, {observe: 'response', headers: headers}).subscribe(
      (response) => {
        console.dir(response);
        this.cachedSession.user = response.body;
        this.cachedSession.token = response.headers.get('Authorization');
        this.cachedSession.isAuthenticated = true;
        this.session.next(this.cachedSession);
        this.cookieSrv.put('system-g-unx-data', btoa(user.userName + '||' + user.password));
        return response.body;
      },
      (error) => {
        console.log(error);
        this.session.next(null);
      }
    );
  }

  getUserById(userId: number): Observable<UserModel> {
    return this.http.get<UserModel>(AppSettings.API_ENDPOINT + 'user/' + userId, {observe: 'response'}).map(
      (response) => {
        console.dir(response);
        return response.body;
      },
      (error) => {
        console.log(error);
        return null;
      }
    );

  }

  // logout method cleans all cookies and session object
  logOut() {
    this.cookieSrv.remove('system-g-unx-data');
    this.cachedSession = new SessionModel(null, null, false);
    this.router.navigate(['']);
    this.session.next(this.cachedSession);
  }

  register(user: UserModel) {

     user.password = Md5.hashStr(user.password).toString();

    this.http.post<UserModel>(AppSettings.API_ENDPOINT + 'user/register', user, {observe: 'response'}).subscribe(
      (response) => {
        console.dir(response);
        this.cachedSession.user = response.body;
        this.cachedSession.token = response.headers.get('Authorization');
        this.cachedSession.isAuthenticated = true;
        this.session.next(this.cachedSession);
        this.cookieSrv.put('system-g-unx-data',
          btoa(user.userName + '||' + user.password));
        return response.body;
      },
      (error) => {
        console.log(error);
         this.session.next(null);
      }
    );

  }

  getSession(): SessionModel {
    return this.clone<SessionModel>(this.cachedSession);
  }

  test() {
    this.http.get('http://vuta-alexandru.com:8080/Galleo/gallery/').subscribe(
      (response) => {
        console.dir(response);
      },
      (error2 => {
        console.dir(error2);
      })
    );
  }
  loginByCookie() {
    if (this.cookieSrv.get('system-g-unx-data')) {

      const cook = atob(this.cookieSrv.get('system-g-unx-data')).split('||');
      const user = new UserModel();
      user.userName = cook[0];
      user.password = cook[1];

      const headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');

      this.http.post<UserModel>(this.apiUrl, user, {observe: 'response', headers: headers}).subscribe(
        (response) => {
          console.dir(response);
          this.cachedSession.user = response.body;
          this.cachedSession.token = response.headers.get('Authorization');
          this.cachedSession.isAuthenticated = true;
          this.session.next(this.cachedSession);
          return response.body;
        },
        (error) => {
          console.log(error);
          this.session.next(null);
        }
      );
    }
  }

  private clone<T>(instance: T): T {
    if (this.cachedSession != null) {
      const copy = new (instance.constructor as { new (): T })();
      Object.assign(copy, instance);
      return copy;
    }
    return null;
  }


}
