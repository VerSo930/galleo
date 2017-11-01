import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AdminComponent} from './admin/admin.component';
import {HomeComponent} from './home/home.component';
import {AllPhotosComponent} from './home/all-photos/all-photos.component';
import {WelcomeComponent} from './home/welcome/welcome.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent, children: [
    {path: '', component: WelcomeComponent },
    {path: 'view-all-photos', component: AllPhotosComponent}
  ] },
  { path: 'view-profile/:userId', loadChildren: './profile/profile.module#ProfileModule' },
  { path: 'admin', component: AdminComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule],
  declarations: []
})

export class AppRoutingModule { }
