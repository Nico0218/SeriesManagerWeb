import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { Video } from '../../../classes/Models/Video';
import { VideoStreamService } from '../../../services/video-stream.service';

@Component({
  selector: 'video-viewer-component',
  templateUrl: './video-viewer.component.html',
  styleUrls: ['./video-viewer.component.scss']
})
export class VideoViewerComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject();
  VideoURL: SafeUrl;
  @Input() selectedVideo: Video;

  constructor(private videoGalleryService: VideoStreamService) { }

  ngOnInit(): void {
    this.GetVideoURL();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public GetVideoURL() {
    this.VideoURL = this.videoGalleryService.GetVideoStream(this.selectedVideo);
  }

  public PlaybackError(error) {
    // video playback failed - show a message saying why
    switch (error.target.error.code) {
      case error.target.error.MEDIA_ERR_ABORTED:
        alert('You aborted the video playback.');
        break;
      case error.target.error.MEDIA_ERR_NETWORK:
        alert('A network error caused the video download to fail part-way.');
        break;
      case error.target.error.MEDIA_ERR_DECODE:
        alert('The video playback was aborted due to a corruption problem or because the video used features your browser did not support.');
        break;
      case error.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
        alert('The video could not be loaded, either because the server or network failed or because the format is not supported.');
        break;
      default:
        alert('An unknown error occurred.');
        break;
    }
  }
}