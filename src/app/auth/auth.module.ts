import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthRoutingModule} from './auth-routing.module';
import {BrowserModule} from '@angular/platform-browser';
import {AuthService} from './auth.service';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
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
