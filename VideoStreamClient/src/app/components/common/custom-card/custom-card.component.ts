import { APP_BASE_HREF } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';

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

    constructor(@Inject(APP_BASE_HREF) baseHref: string) {
        if (baseHref && baseHref != '/') {
            this.thumbnail = baseHref + "assets/image-placeholder.png";
        } else {
            this.thumbnail = '../../../assets/image-placeholder.png';
        }
    }
}