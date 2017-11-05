import {Component, Inject, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Subscription} from 'rxjs/Subscription';
import {UserModel} from '../../shared/model/user.model';
import {Subject} from 'rxjs/Subject';
import {Router} from '@angular/router';
import {SessionModel} from '../../shared/model/session.model';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit, OnDestroy {

  siForm: FormGroup;
  userName: FormControl;
  password: FormControl;
  loading = false;
  authSuccess = null;
  authMessage = null;

  subscription: Subscription;

  constructor(@Inject(DOCUMENT) private document: Document,
              private authService: AuthService,
              private router: Router) {

  }

  ngOnInit(): void {

    this.document.body.removeAttribute('class');
    this.document.body.classList.add('login-page');
    this.document.body.classList.add('sidebar-collapse');

    this.createForm();

    /* this.subscription = this.authService.session.subscribe((session: SessionModel) => {
       this.loading = false;
       console.dir(session);
         if (!session.isAuthenticated) {
           this.showError(session.message);
         } else {
           this.router.navigate(['./', 'view-profile', session.user.id, 'detail']).then(
             value => {
               console.log('router to profile:' + value);
             }
           );
         }
     } );*/

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    this.loading = true;
    this.authService.login(this.siForm.get('userName').value, this.siForm.get('password').value)
      .subscribe(
        (response) => {
          this.loading = false;
          console.dir(response);
          if (response == null) {
            this.showError('An error occured. Please try again later (NETWORK-ERR)');
          } else if (response.status === 401) {
            this.showError('Wrong username and password! Try again with correct credentials!');
          } else {
            this.router.navigate(['./', 'view-profile', response.body.id, 'detail']);
          }

        },
        err => {
          this.loading = false;
          this.showError('Wrong username and password! Try again with correct credentials!');
          console.dir('error finally');
        }
      );
  }


  createForm() {
    this.siForm = new FormGroup({
      'userName': new FormControl('', [Validators.required]),
      'password': new FormControl('', Validators.required)
    });
  }

  showError(error: string) {

    this.authMessage = error;
    this.authSuccess = false;

    setTimeout(() => {
      this.authSuccess = null;
      this.authMessage = null;
    }, 10000);
  }

}
