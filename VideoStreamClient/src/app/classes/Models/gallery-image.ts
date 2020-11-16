import { LogicModelBase } from './logic-model-base';
import { SafeUrl } from '@angular/platform-browser';

export class GalleryImage extends LogicModelBase {
    public galleryID: string;
    public filePath: string;
    public indexDate: string;
    public data: SafeUrl;
    public imageThumbnail: SafeUrl;
}