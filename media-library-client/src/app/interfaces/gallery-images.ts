import LogicModelBase from "./logic-model-base";

export default interface GalleryImage extends LogicModelBase {
    galleryID: string;
    filePath: string;
    indexDate: string;
    data: string;
    imageThumbnail: string;
    imageComparisonHash : string;
}

