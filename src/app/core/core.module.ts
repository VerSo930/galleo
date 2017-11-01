import { HeaderComponent } from './header/header.component';
import {AppRoutingModule} from '../app-routing.module';
import {AdminComponent} from '../admin/admin.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptor} from '../shared/interceptor/auth.interceptor';
import { CommonModule } from '@angular/common';
import {
  APP_INITIALIZER,
  ModuleWithProviders, NgModule,
  Optional, SkipSelf
} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {AuthGuard} from '../auth/auth-guard.service';
import {FooterComponent} from './footer/footer.component';
import {DataStorageService} from '../shared/storage/data-storage.service';
import {ProgressInterceptor} from '../shared/interceptor/progress.interceptor';
/*let interceptor = () => {
  return new ProgressInterceptor();
};*/
export const interceptor: ProgressInterceptor = new ProgressInterceptor();

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    HttpClientModule
  ],
  exports: [
    AppRoutingModule,
    HeaderComponent,
    FooterComponent,
    AdminComponent

  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    AdminComponent,
  ],
  providers: [
    DataStorageService,
    AuthService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    { provide: ProgressInterceptor, useValue: interceptor },
    { provide: HTTP_INTERCEPTORS, useValue: interceptor, multi: true }
  ]
})

export class CoreModule {

  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }

  /*static forRoot(): ModuleWithProviders {

    return {
      ngModule: CoreModule,
      providers: [
        AuthService,
        AuthGuard,
        DataStorageService,
        {
          provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
        },
        { provide: ProgressInterceptor, useValue: interceptorLoader() },
        { provide: HTTP_INTERCEPTORS, useValue: interceptorLoader(), multi: true }
      ]
    };*/

}
