import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { ImageGallery } from '../../../classes/Models/image-gallery';
import { GalleryImage } from '../../../classes/Models/gallery-image';
import { ImageGalleryService } from '../../../services/image-gallery.service';
import { ImageService } from '../../../services/image.service';
import { UIBase } from '../../common/ui-base-component/ui-base.component';
import { ImageViewerComponent } from '../image-viewer-component/image-viewer.component';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'image-list-component',
    templateUrl: './image-list.component.html',
    styleUrls: ['./image-list.component.scss']
})
export class ImageListComponent extends UIBase implements OnInit, OnDestroy {
    @ViewChild(ImageViewerComponent) imageViewer?: ImageViewerComponent;
    public imageGallery?: ImageGallery;
    public Images?: GalleryImage[];
    public selectedImage?: GalleryImage;
    public page = 1;
    public pageSize = 16;
    public collectionSize = 0;

    constructor(private imageGalleryService: ImageGalleryService,
        private imageService: ImageService,
        private activeRoute: ActivatedRoute,
        private router: Router) {
        super(router.config);
    }

    async ngOnInit() {
        this.loading = true;
        if (!history.state.imageGallery) {
            //redirect to not found
            this.activeRoute.paramMap.pipe(
                map((params: ParamMap) => {
                    const objID = params.get('objID');
                    if (objID) {
                        this.imageGalleryService.GetByID(objID)
                            .pipe(
                                map(imageGallery => {
                                    this.onImageGalleryReady(imageGallery);
                                }),
                                take(1)
                            )
                            .subscribe()
                    }
                }
                ),
                take(1)
            ).subscribe();
        } else {
            this.onImageGalleryReady(history.state.imageGallery);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    private async onImageGalleryReady(imageGallery: ImageGallery) {
        this.imageGallery = imageGallery;
        this.loadBreadcrumb();
        this.collectionSize = await firstValueFrom(this.imageService.GetCountByGallery(this.imageGallery.id));
        this.loadImagePage();
    }

    pageChange() {
        this.loading = true;
        this.loadImagePage();
    }

    private loadImagePage() {
        if (this.imageGallery) {
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
        } else {
            console.error(`Image Gallery has not been set.`);
        }
    }

    private loadBreadcrumb() {
        if (this.imageGallery) {
            this.AddBreadCrumbItem("Home");
            this.AddBreadCrumbItem("ImageGalleryList");
            this.AddBreadCrumbItem("ImageList", this.imageGallery.displayName, this.imageGallery.id);
        } else {
            console.error(`Image Gallery has not been set.`);
        }
    }

    selectCard(image: GalleryImage) {
        var modal = document.getElementById("myModal");
        if (modal)
            modal.style.display = "block";
        if (this.imageViewer) {
            this.imageViewer.selectedImage = image;
            this.imageViewer.LoadImage();
        }
    }

    closePopupModal() {
        var modal = document.getElementById("myModal");
        if (modal)
            modal.style.display = "none";
    }

    private async loadThumbnails() {
        if (this.Images) {
            this.Images.forEach(async image => {
                image.imageThumbnail = await firstValueFrom(this.imageService.GetThumbnailByID(image.id, 200));
            });
        } else {
            console.error(`Images has not been set.`);
        }
    }

    download(id: string) {
        console.log(id);
    }
}