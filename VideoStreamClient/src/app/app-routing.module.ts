import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ImageGalleryListComponent } from './components/images/image-gallery-list-component/image-gallery-list.component';
import { VideoListComponent } from './components/video/video-list-component/video-list.component';
import { ImageListComponent } from './components/images/image-list-component/image-list.component';
import { VideoGalleryListComponent } from './components/video/video-gallery-list-component/video-gallery-list.component';
import { MissingPageComponent } from './components/missing-page-component/missing-page.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'image-gallery-list', component: ImageGalleryListComponent },
  { path: 'image-list', component: ImageListComponent },
  { path: 'series-gallery-list', component: VideoGalleryListComponent },
  { path: 'series-episode-list/:seriesID', component: VideoListComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: MissingPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
