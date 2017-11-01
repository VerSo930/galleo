import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {SharedModule} from './shared/shared.module';
import {AppRoutingModule} from './app-routing.module';
import {AuthModule} from './auth/auth.module';
import {CoreModule} from './core/core.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {ProfileModule} from './profile/profile.module';
import {InlineEditorModule} from '@qontu/ngx-inline-editor';
import {CookieModule} from 'ngx-cookie';
import {AuthService} from './auth/auth.service';
import {DataStorageService} from './shared/storage/data-storage.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TruncateModule} from 'ng2-truncate';
import { HomeComponent } from './home/home.component';
import { AllPhotosComponent } from './home/all-photos/all-photos.component';
import { WelcomeComponent } from './home/welcome/welcome.component';
import {PhotoListComponent} from './shared/photo-list/photo-list.component';
import {HttpModule} from '@angular/http';
import {FooterComponent} from './core/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AllPhotosComponent,
    WelcomeComponent,
    ],
  imports: [
    InlineEditorModule,
    BrowserModule,
    BrowserAnimationsModule,
    // CoreModule.forRoot(),
    CoreModule,
    CookieModule.forRoot(),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AuthModule,
    ProfileModule,
    InfiniteScrollModule,
  ],
  exports: [
    FooterComponent
  ],
  providers: [
    AuthModule,
    PhotoListComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
