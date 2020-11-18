import { Routes } from '@angular/router';
import { Subject } from 'rxjs';
import { BreadcrumbItem } from '../../../classes/breadcrumb-item';

export abstract class UIBase {
    public destroy$: Subject<boolean> = new Subject();
    public breadcrumbItems: BreadcrumbItem[] = [];
    public loading = true;
    public paths: { [key: string]: string } = {};

    constructor(routes: Routes) {
        routes.forEach(route => {
            if (route.component) {
                this.paths[route.component.name.replace("Component", "")] = route.path;
            }
        });
    }

    public AddBreadcrumItem(componentName: string, displayName: string = undefined, objID: string = undefined) {
        const breadcrumbItem = new BreadcrumbItem();
        breadcrumbItem.id = componentName;
        breadcrumbItem.label = displayName ? displayName : componentName;
        breadcrumbItem.path = "/" + this.paths[componentName];
        if (objID) {
            breadcrumbItem.path = breadcrumbItem.path.replace(":objID", objID);
        }
        this.breadcrumbItems.push(breadcrumbItem);
    }
}