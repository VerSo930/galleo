
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProfileComponent} from './profile.component';
import {AuthGuard} from '../auth/auth-guard.service';
import {GalleryDetailComponent} from './gallery-detail/gallery-detail.component';
import {ProfileDetailComponent} from './profile-detail/profile-detail.component';

const profileRoutes: Routes = [
  {path: '', component: ProfileComponent, canActivate:  [AuthGuard], children: [
    { path: 'detail', component: ProfileDetailComponent },
    { path: 'gallery-detail/:galleryId', component: GalleryDetailComponent },
   // { path: 'gallery-list', component: GalleryListComponent },

  ]}
];

@NgModule({
  imports: [
    RouterModule.forChild(profileRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [AuthGuard]
})
export class ProfileRoutingModule { }
