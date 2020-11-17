import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { GalleryImage } from '../../../classes/Models/gallery-image';
import { ImageGalleryService } from '../../../services/image-gallery.service';
import { map, take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ImageViewerComponent } from '../image-viewer-component/image-viewer.component';
import { UIBase } from '../../common/ui-base-component/ui-base.component';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ImageService } from 'src/app/services/image.service';

@Component({
    selector: 'image-list-component',
    templateUrl: './image-list.component.html',
    styleUrls: ['./image-list.component.scss']
})
export class ImageListComponent extends UIBase implements OnInit, OnDestroy {
    @ViewChild(ImageViewerComponent) imageViewer: ImageViewerComponent;
    private destroy$: Subject<boolean> = new Subject();
    public GalleryID: string;
    public Images: GalleryImage[];
    public selectedImage: GalleryImage;
    public page = 1;
    public pageSize = 12;
    public collectionSize = 0;
    public loading = true;

    constructor(private imageGalleryService: ImageGalleryService,
        private imageService: ImageService,
        private router: Router,
        private activeRoute: ActivatedRoute) {
        super();
    }

    async ngOnInit() {
        this.loadBreadcrumb();
        this.GalleryID = await this.activeRoute.paramMap.pipe(
            map((params: ParamMap) => {
                return params.get('galleryID') as string;
            }),
            take(1)
        ).toPromise();

        this.collectionSize = await this.imageGalleryService.GetGalleryImageCount(this.GalleryID).toPromise();

        this.loadImagePage();
    }

    pageChange() {
        this.loading = true;
        this.loadImagePage();
    }

    private loadImagePage() {
        this.imageService.GetImagesByPage(this.GalleryID, this.page, this.pageSize)
            .pipe(
                map(result => {
                    this.Images = result;
                    this.loadThumbnails();
                    this.loading = false;
                }),
                take(1)
                // takeUntil(this.destroy$)
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

    selectCard(image: GalleryImage) {
        if (this.imageViewer) {
            this.imageViewer.selectedImage = image;
            this.imageViewer.LoadImage();
        }
    }

    private async loadThumbnails() {
        this.Images.forEach(async image => {
            image.imageThumbnail = await this.imageService.GetImageThumbnailByID(image.id, 200).toPromise();
        });
    }
}