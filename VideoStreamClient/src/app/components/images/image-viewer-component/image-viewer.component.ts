import { Component, Input, OnInit } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { GalleryImage } from '../../../classes/Models/gallery-image';
import { ImageService } from '../../../services/image.service';

@Component({
    selector: 'image-viewer-component',
    templateUrl: './image-viewer.component.html',
    styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit {
    @Input() selectedImage?: GalleryImage;
    public loading = false;

    constructor(private imageService: ImageService) {

    }

    ngOnInit(): void {

    }

    public LoadImage() {
        if (this.selectedImage) {
            this.loading = true;
            this.imageService.GetDataByID(this.selectedImage.id)
                .pipe(
                    map(ii => {
                        if (this.selectedImage) {
                            this.selectedImage.data = ii;
                            this.loading = false;
                        }
                    }),
                    take(1)
                )
                .subscribe();
        }
    }
}