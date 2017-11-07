import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import {ProfileRoutingModule} from './profile-routing.module';
import {ProfileComponent} from './profile.component';
import {SharedModule} from '../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {GalleryDetailComponent} from './gallery-detail/gallery-detail.component';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import { ProfileDetailComponent } from './profile-detail/profile-detail.component';
import {TruncateModule} from 'ng2-truncate';
import {PhotoListComponent} from '../shared/photo-list/photo-list.component';
import {FooterComponent} from '../core/footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    FormsModule,
    TruncateModule,
    ReactiveFormsModule,
  ],

  declarations: [
    ProfileComponent,
    ProfileEditComponent,
    GalleryDetailComponent,
    ProfileDetailComponent,

  ],

  providers: [
    InfiniteScrollModule,
    PhotoListComponent,
    FooterComponent,
  ],
  exports: [

  ]
})
export class ProfileModule { }
