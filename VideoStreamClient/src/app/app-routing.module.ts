import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ImageGalleryListComponent } from './components/images/image-gallery-list-component/image-gallery-list.component';
import { VideoListComponent } from './components/video/video-list-component/video-list.component';
import { ImageListComponent } from './components/images/image-list-component/image-list.component';
import { VideoGalleryListComponent } from './components/video/video-gallery-list-component/video-gallery-list.component';
import { MissingPageComponent } from './components/missing-page-component/missing-page.component';
import { ConfigMainComponent } from './components/config/config-main.component';
import { AuthGuard } from './helpers/auth.guard';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'image-gallery-list', component: ImageGalleryListComponent, canActivate: [AuthGuard] },
  { path: 'image-list', component: ImageListComponent, canActivate: [AuthGuard] },
  { path: 'series-gallery-list', component: VideoGalleryListComponent, canActivate: [AuthGuard] },
  { path: 'series-episode-list/:seriesID', component: VideoListComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: ConfigMainComponent, canActivate: [AuthGuard], data: { role: [0] } },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: MissingPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
