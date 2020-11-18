import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { ImageGallery } from '../../../classes/Models/image-gallery';
import { ImageGalleryService } from '../../../services/image-gallery.service';
import { UIBase } from '../../common/ui-base-component/ui-base.component';

@Component({
    selector: 'image-gallery-list-component',
    templateUrl: './image-gallery-list.component.html',
    styleUrls: ['./image-gallery-list.component.scss']
})
export class ImageGalleryListComponent extends UIBase implements OnInit, OnDestroy {
    Galleries: ImageGallery[] = [];

    constructor(private imageGalleryService: ImageGalleryService) {
        super();

    }

    ngOnInit(): void {
        this.loadBreadcrumb();
        this.imageGalleryService.GetAll()
            .pipe(
                map(ii => {
                    this.Galleries = ii;
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
                id: 'image-gallery-list',
                label: 'Image Galleries',
                path: '/image-gallery-list'
            }
        ];
    }
}