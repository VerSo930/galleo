import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SigninComponent} from './signin/signin.component';
import {SignupComponent} from './signup/signup.component';

const authRoutes: Routes = [
  { path: 'signup', component: SignupComponent},
  { path: 'signin', component: SigninComponent},
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(authRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AuthRoutingModule { }
