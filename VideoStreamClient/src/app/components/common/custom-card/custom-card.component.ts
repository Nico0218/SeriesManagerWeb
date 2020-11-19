import { APP_BASE_HREF } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { faDownload, faEllipsisH } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'custom-card-component',
    templateUrl: './custom-card.component.html',
    styleUrls: ['./custom-card.component.scss']
})
export class CustomCardComponent {
    @Input() route: any[];
    @Input() title: string;
    @Input() description: string;
    @Input() thumbnail: string;
    @Input() showButtons = false;
    @Input() itemID: string;
    @Output() onImg = new EventEmitter<null>();
    @Output() onDownload = new EventEmitter<string>();
    // @Output() Download = new EventEmitter<string>();

    faDownload = faDownload;
    faEllipsisH = faEllipsisH;

    constructor(@Inject(APP_BASE_HREF) baseHref: string) {
        if (baseHref && baseHref != '/') {
            this.thumbnail = baseHref + "assets/image-placeholder.png";
        } else {
            this.thumbnail = '../../../assets/image-placeholder.png';
        }
    }

    onImgClick() {
        this.onImg.emit();
    }

    onDownloadClick() {
        this.onDownload.emit(this.itemID);
    }
}