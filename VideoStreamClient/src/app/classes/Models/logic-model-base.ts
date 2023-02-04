import { ObjectStatus } from '../../enums/config/object-status';

export interface LogicModelBase {
    id: string;
    name: string;
    displayName: string;
    status: ObjectStatus;
}