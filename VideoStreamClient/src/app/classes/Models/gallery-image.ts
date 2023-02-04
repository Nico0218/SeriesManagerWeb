import { LogicModelBase } from './logic-model-base';
import { SafeUrl } from '@angular/platform-browser';

export interface GalleryImage extends LogicModelBase {
    galleryID: string;
    filePath: string;
    indexDate: string;
    data: SafeUrl;
    imageThumbnail: SafeUrl;
}