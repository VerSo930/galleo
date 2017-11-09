import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {DOCUMENT} from '@angular/common';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {UserModel} from '../../shared/model/user.model';
import {RoleModel} from '../../shared/model/role.model';
import {SessionModel} from '../../shared/model/session.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  siForm: FormGroup;
  name: FormControl;
  lastName: FormControl;
  userName: FormControl;
  email: FormControl;
  password: FormControl;
  passwordConfirmation: FormControl;
  thermsConditions: FormControl;

  authFired = false;
  authSuccess = null;
  authMessage = null;

  subscription: Subscription;

  constructor(@Inject(DOCUMENT) private document: Document,
              private authService: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {

    this.subscription = this.authService.session.subscribe(
      (session: SessionModel) => {
        if (session) {
          this.router.navigate(['./', 'view-profile', session.user.id, 'detail']);
        }
      }
    );


    this.document.body.removeAttribute('class');
    this.document.body.classList.add('login-page');
    this.document.body.classList.add('sidebar-collapse');

    this.createFormControls();
    this.createForm();

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    this.authFired = true;
    const user = new UserModel();
    user.name = this.name.value;
    user.lastName = this.lastName.value;
    user.email = this.email.value;
    user.userName = this.userName.value;
    user.password = this.password.value;
    user.avatar = null;
    user.role = 2;
    this.authService.register(user);
  }

  createFormControls() {
    this.name = new FormControl('', [Validators.required, Validators.minLength(2)]);
    this.lastName = new FormControl('', [Validators.required, Validators.minLength(2)]);
    this.userName = new FormControl('', [Validators.required, Validators.minLength(2)]);
    this.email = new FormControl('', [Validators.required, Validators.pattern('[^ @]*@[^ @]*')]);
    this.password = new FormControl('', [Validators.required, Validators.minLength(8)]);
    this.passwordConfirmation = new FormControl('', [Validators.required, Validators.minLength(8)]);
    this.thermsConditions = new FormControl(false, [Validators.required, Validators.minLength(8)]);
  }

  createForm() {
    this.siForm = new FormGroup({
      name: this.name,
      lastName: this.lastName,
      userName: this.userName,
      email: this.email,
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      passwordConfirmation: this.passwordConfirmation,

    });

  }

  isFieldValid(field: string) {
    return !this.siForm.get(field).valid && this.siForm.get(field).touched;
  }

  showError(error: string) {

    this.authMessage = error;
    this.authSuccess = false;

    setTimeout(() => {
      this.authSuccess = null;
      this.authMessage = null;
    }, 5000);
  }


}
