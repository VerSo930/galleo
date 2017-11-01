import {Injectable} from '@angular/core';
import {HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {ReplaySubject} from 'rxjs/ReplaySubject';


@Injectable()
export class ProgressInterceptor implements HttpInterceptor {
  public progress$: Observable<number | null>;
  private progressSubject: Subject<number | null>;

  constructor() {
    this.progressSubject = new ReplaySubject<number | null>(1);
    this.progress$ = this.progressSubject.asObservable();
  }

  intercept<T>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {

    const reportingRequest = req.clone({reportProgress: true});
    const handle = next.handle(reportingRequest);

    return handle.map((event: HttpEvent<T>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          this.progressSubject.next(null);
          break;
        case HttpEventType.DownloadProgress:
        case HttpEventType.UploadProgress:
          if (event.total) {
            this.progressSubject.next(Math.round((event.loaded / event.total) * 100));
          }
          break;
        case HttpEventType.Response:
          this.progressSubject.next(100);
          break;
      }
      return event;
    });

  }
}


