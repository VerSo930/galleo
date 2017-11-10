import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthRoutingModule} from './auth-routing.module';
import {BrowserModule} from '@angular/platform-browser';
import {AuthService} from './auth.service';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    SharedModule,
    AuthRoutingModule
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule
  ],

  declarations: [SignupComponent, SigninComponent],
  providers: [ ]
})
export class AuthModule { }
