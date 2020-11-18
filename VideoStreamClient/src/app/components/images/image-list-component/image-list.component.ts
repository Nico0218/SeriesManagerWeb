import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { ImageGallery } from 'src/app/classes/Models/image-gallery';
import { GalleryImage } from '../../../classes/Models/gallery-image';
import { ImageGalleryService } from '../../../services/image-gallery.service';
import { ImageService } from '../../../services/image.service';
import { UIBase } from '../../common/ui-base-component/ui-base.component';
import { ImageViewerComponent } from '../image-viewer-component/image-viewer.component';

@Component({
    selector: 'image-list-component',
    templateUrl: './image-list.component.html',
    styleUrls: ['./image-list.component.scss']
})
export class ImageListComponent extends UIBase implements OnInit, OnDestroy {
    @ViewChild(ImageViewerComponent) imageViewer: ImageViewerComponent;    
    public imageGallery: ImageGallery;
    public Images: GalleryImage[];
    public selectedImage: GalleryImage;
    public page = 1;
    public pageSize = 12;
    public collectionSize = 0;    

    constructor(private imageGalleryService: ImageGalleryService,
        private imageService: ImageService,
        private router: Router,
        private activeRoute: ActivatedRoute) {
        super();
    }

    async ngOnInit() {
        this.loading = true;
        if (!history.state.imageGallery) {
            //redirect to not found
            this.activeRoute.paramMap.pipe(
                map((params: ParamMap) =>
                    this.imageGalleryService.GetByID(params.get('galleryID'))
                        .pipe(
                            map(imageGallery => {
                                this.onImageGalleryReady(imageGallery);
                            }),
                            take(1)
                        )
                        .subscribe()
                ),
                take(1)
            ).subscribe();
        } else {
            this.onImageGalleryReady(history.state.imageGallery);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private async onImageGalleryReady(imageGallery: ImageGallery) {
        this.imageGallery = imageGallery;
        this.loadBreadcrumb();
        this.collectionSize = await this.imageService.GetCountByGallery(this.imageGallery.id).toPromise();
        this.loadImagePage();
    }

    pageChange() {
        this.loading = true;
        this.loadImagePage();
    }

    private loadImagePage() {
        this.imageService.GetByPage(this.imageGallery.id, this.page, this.pageSize)
            .pipe(
                map(result => {
                    this.Images = result;
                    this.loadThumbnails();
                    this.loading = false;
                }),
                take(1)
            )
            .subscribe();
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
                id: this.imageGallery.id,
                label: this.imageGallery.displayName,
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
            image.imageThumbnail = await this.imageService.GetThumbnailByID(image.id, 200).toPromise();
        });
    }
}