import { Component, Input } from '@angular/core';

@Component({
    selector: 'custom-card-component',
    templateUrl: './custom-card.component.html',
    styleUrls: ['./custom-card.component.scss']
})
export class CustomCardComponent {
    @Input() route: any[];
    @Input() title: string;
    @Input() description: string;
    @Input() thumbnail: string = '../../../assets/image-placeholder.png';
}