import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ImageGalleryListComponent } from './components/images/image-gallery-list-component/image-gallery-list.component';
import { HomeComponent } from './components/home/home.component';
import { VideoHostComponent } from './components/video/video-host-component/video-host.component';
import { VideoListComponent } from './components/video/video-list-component/video-list.component';
import { VideoStreamService } from './services/video-stream.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ConfigService } from './services/config.service';
import { ImageGalleryService } from './services/image-gallery.service';
import { ImageListComponent } from './components/images/image-list-component/image-list.component';
import { ImageViewerComponent } from './components/images/image-viewer-component/image-viewer.component';
import { VideoGalleryService } from './services/video-gallery.service';
import { VideoGalleryListComponent } from './components/video/video-gallery-list-component/video-gallery-list.component';
import { MissingPageComponent } from './components/missing-page-component/missing-page.component';
import { CustomCardComponent } from './components/common/custom-card/custom-card.component';
import { BreadcrumComponent } from './components/common/breadcrumb/breadcrum.component';
import { ConfigMainComponent } from './components/config/config-main.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';

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
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    FontAwesomeModule
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
