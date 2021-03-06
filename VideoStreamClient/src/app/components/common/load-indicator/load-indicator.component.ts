import { Component, Input } from '@angular/core';

@Component({
    selector: 'load-indicator-component',
    templateUrl: './load-indicator.component.html',
    styleUrls: ['./load-indicator.component.scss']
})
export class LoadIndicatorComponent {
    @Input() fullscreen = true;
}