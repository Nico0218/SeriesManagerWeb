import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyModule } from '@ngx-formly/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BreadcrumComponent } from './components/common/breadcrumb/breadcrum.component';
import { CustomCardComponent } from './components/common/custom-card/custom-card.component';
import { ConfigMainComponent } from './components/config/config-main.component';
import { HomeComponent } from './components/home/home.component';
import { ImageGalleryListComponent } from './components/images/image-gallery-list-component/image-gallery-list.component';
import { ImageListComponent } from './components/images/image-list-component/image-list.component';
import { ImageViewerComponent } from './components/images/image-viewer-component/image-viewer.component';
import { LoginComponent } from './components/login/login.component';
import { MissingPageComponent } from './components/missing-page-component/missing-page.component';
import { VideoGalleryListComponent } from './components/video/video-gallery-list-component/video-gallery-list.component';
import { VideoHostComponent } from './components/video/video-host-component/video-host.component';
import { VideoListComponent } from './components/video/video-list-component/video-list.component';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { AuthenticationService } from './services/authentication.service';
import { ConfigService } from './services/config.service';
import { ImageGalleryService } from './services/image-gallery.service';
import { UserService } from './services/user.service';
import { VideoGalleryService } from './services/video-gallery.service';
import { VideoStreamService } from './services/video-stream.service';
import { RepeatTypeComponent } from './ui-components/repeat-section/repeat-section.type';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    VideoGalleryListComponent,
    VideoListComponent,
    VideoHostComponent,
    ImageGalleryListComponent,
    ImageListComponent,
    ImageViewerComponent,
    MissingPageComponent,
    CustomCardComponent,
    BreadcrumComponent,
    ConfigMainComponent,
    LoginComponent,
    RepeatTypeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    FormlyModule.forRoot(
      {
        extras: {
          lazyRender: true
        },
        types: [
          { name: 'repeat', component: RepeatTypeComponent },
        ]
      }),
    FormlyBootstrapModule
  ],
  providers: [
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: (configService: ConfigService) =>
        () => configService.loadAppsettings(),
      deps: [ConfigService],
      multi: true
    },
    VideoGalleryService,
    VideoStreamService,
    ImageGalleryService,
    AuthenticationService,
    UserService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(router: Router) {

  }
}
