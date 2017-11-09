import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';


import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import { PhotoListComponent } from './photo-list/photo-list.component';
import { GalleryListComponent } from './gallery-list/gallery-list.component';
import {TruncateModule} from 'ng2-truncate';
import { PhotoAddComponent } from './photo-add/photo-add.component';
import {GalleryAddComponent} from './gallery-add/gallery-add.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import {EditPhotoComponent} from './photo-edit/photo-edit.component';
import { FiledDisplayErrorComponent } from './filed-display-error/filed-display-error.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    TruncateModule
  ],

  declarations: [
    PhotoListComponent,
    GalleryListComponent,
    PhotoAddComponent,
    GalleryAddComponent,
    ConfirmationDialogComponent,
    EditPhotoComponent,
    FiledDisplayErrorComponent
  ],

  exports: [
    PhotoListComponent,
    GalleryListComponent,
    InfiniteScrollModule,
    PhotoAddComponent,
    GalleryAddComponent,
    ConfirmationDialogComponent,
    EditPhotoComponent,
    FiledDisplayErrorComponent

  ],
  providers: [

    ]
})

export class SharedModule {
}
