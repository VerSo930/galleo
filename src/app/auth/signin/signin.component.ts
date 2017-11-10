import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {FormControl, FormGroup,  Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Subscription} from 'rxjs/Subscription';
import {Router} from '@angular/router';

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
  }

  onSubmit() {
    this.loading = true;
    this.authService.login(this.siForm.get('userName').value, this.siForm.get('password').value)
      .subscribe(
        (response) => {
          this.loading = false;
          console.dir(response);
          if (response.status === 200) {
            this.router.navigate(['./', 'view-profile', response.body.id, 'detail']);
          }

        },
        err => {
          this.loading = false;
          if (err === 400) {
            this.showError('User params are missing. Please contact us!');
          }
          if (err.status === 401) {
            this.showError('Wrong username and password! Try again with correct credentials!');
          } else if (err === 500) {
            this.showError('Internal Server error. Try again later');
          }
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
