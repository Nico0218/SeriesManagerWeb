import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { GalleryImage } from 'src/app/classes/Models/gallery-image';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ImageService } from 'src/app/services/image.service';

@Component({
    selector: 'image-viewer-component',
    templateUrl: './image-viewer.component.html',
    styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit, OnDestroy {
    @Input() selectedImage: GalleryImage;
    private destroy$: Subject<boolean> = new Subject();

    constructor(private imageService: ImageService) {

    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public LoadImage() {
        if (this.selectedImage) {
            this.imageService.GetImageDataByID(this.selectedImage.id)
                .pipe(
                    map(ii => {
                        this.selectedImage.data = ii;
                    }),
                    takeUntil(this.destroy$)
                )
                .subscribe();
        }
    }
}