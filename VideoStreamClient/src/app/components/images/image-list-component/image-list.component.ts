import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Image } from '../../../classes/Models/image';
import { ImageGalleryService } from '../../../services/image-gallery.service';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ImageViewerComponent } from '../image-viewer-component/image-viewer.component';
import { UIBase } from '../../common/ui-base-component/ui-base.component';

@Component({
    selector: 'image-list-component',
    templateUrl: './image-list.component.html',
    styleUrls: ['./image-list.component.scss']
})
export class ImageListComponent extends UIBase  implements OnInit, OnDestroy {
    @ViewChild(ImageViewerComponent) imageViewer: ImageViewerComponent;
    private destroy$: Subject<boolean> = new Subject();
    public GalleryID: string;
    public Images: Image[];
    public selectedImage: Image;

    constructor(private imageGalleryService: ImageGalleryService) {
        super();
    }

    ngOnInit(): void {
        this.loadBreadcrumb();
        this.imageGalleryService.GetAllImagesByGaleryID(this.GalleryID)
            .pipe(
                map(result => {
                    this.Images = result;
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
            },
            {
                id: this.GalleryID,
                label: 'Walls',
                path: '/image-list'
            }
        ];
    }

    selectCard(image: Image) {
        if (this.imageViewer) {
            this.imageViewer.selectedImage = image;
            this.imageViewer.LoadImage();
        }
    }
}