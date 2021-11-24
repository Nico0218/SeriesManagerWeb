import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

    constructor(private imageGalleryService: ImageGalleryService,
        private router: Router) {
        super(router.config);
        this.loading = true;
    }

    ngOnInit(): void {
        this.loadBreadcrumb();
        this.imageGalleryService.GetAll()
            .pipe(
                map(ii => {
                    this.Galleries = ii;
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
        this.AddBreadCrumbItem("ImageGalleryList");
    }
}