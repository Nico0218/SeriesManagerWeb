import { Component, OnDestroy, OnInit } from '@angular/core';
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
    SeriesList: VideoGallery[] = [];

    constructor(private videoGalleryService: VideoGalleryService) {
        super();
    }

    ngOnInit(): void {
        this.loadBreadcrumb();
        this.videoGalleryService.GetAll()
            .pipe(
                map(ii => {
                    this.SeriesList = ii;
                }),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadBreadcrumb() {
        this.breadcrumbItems = [
            {
                id: 'Home',
                label: 'Home',
                path: '/home'
            },
            {
                id: 'series-gallery-list',
                label: 'Series Gallery',
                path: '/series-gallery-list'
            }
        ];
    }
}