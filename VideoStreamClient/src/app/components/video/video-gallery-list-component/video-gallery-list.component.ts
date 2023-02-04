import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, takeUntil } from 'rxjs/operators';
import { VideoGallery } from '../../../classes/Models/video-gallery';
import { VideoGalleryService } from '../../../services/video-gallery.service';
import { UIBase } from '../../common/ui-base-component/ui-base.component';

@Component({
    selector: 'video-gallery-list-component',
    templateUrl: './video-gallery-list.component.html',
    styleUrls: ['./video-gallery-list.component.scss']
})
export class VideoGalleryListComponent extends UIBase implements OnInit, OnDestroy {
    videoList: VideoGallery[] = [];

    constructor(private videoGalleryService: VideoGalleryService,
        private router: Router) {
        super(router.config);
    }

    ngOnInit(): void {
        this.loading = true;
        this.loadBreadcrumb();
        this.videoGalleryService.GetAll()
            .pipe(
                map(ii => {
                    this.videoList = ii;
                    this.loading = false;
                }),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    private loadBreadcrumb() {
        this.AddBreadCrumbItem("Home");
        this.AddBreadCrumbItem("VideoGalleryList");
    }
}