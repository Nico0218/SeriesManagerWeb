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
                if (route.path) {
                    var routeID = route.path;
                    while (routeID.includes("-")) {
                        routeID = routeID.replace("-", "");
                    }
                    if (routeID.includes("/"))
                        routeID = routeID.substring(0, routeID.indexOf("/"));
                    this.paths[routeID] = routeID;
                }
            }
        });
    }

    public AddBreadCrumbItem(componentName: string, displayName: string = "", objID: string = "") {
        const breadcrumbItem: BreadcrumbItem = {
            id: componentName,
            label: displayName ? displayName : componentName,
            path: "/" + this.paths[componentName.toLowerCase()]
        };
        if (objID) {
            breadcrumbItem.path = breadcrumbItem.path.replace(":objID", objID);
        }
        this.breadcrumbItems.push(breadcrumbItem);
    }
}