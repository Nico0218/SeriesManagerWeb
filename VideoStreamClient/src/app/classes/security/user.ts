import { UserRoles } from '../../enums/security/user-roles';
import { LogicModelBase } from '../Models/logic-model-base';

export interface User extends LogicModelBase {
    password: string;
    role: UserRoles;
    token: string;
}