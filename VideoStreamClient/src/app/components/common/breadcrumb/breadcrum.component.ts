import { Component, Input } from '@angular/core';
import { BreadcrumbItem } from '../../../classes/breadcrumb-item';

@Component({
    selector: 'breadcrum-component',
    templateUrl: './breadcrum.component.html',
    styleUrls: ['./breadcrum.component.scss']
})
export class BreadcrumComponent {
    @Input() breadcrumbItems: BreadcrumbItem[];
    constructor() {

    }
}