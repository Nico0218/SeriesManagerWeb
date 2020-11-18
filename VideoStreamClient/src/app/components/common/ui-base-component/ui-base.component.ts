import { Subject } from 'rxjs';
import { BreadcrumbItem } from '../../../classes/breadcrumb-item';

export abstract class UIBase {
    public destroy$: Subject<boolean> = new Subject();
    public breadcrumbItems: BreadcrumbItem[];
    public loading = true;
}