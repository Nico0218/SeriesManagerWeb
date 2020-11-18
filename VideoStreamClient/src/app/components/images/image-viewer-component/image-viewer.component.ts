import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { GalleryImage } from '../../../classes/Models/gallery-image';
import { ImageService } from '../../../services/image.service';

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
            this.imageService.GetDataByID(this.selectedImage.id)
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