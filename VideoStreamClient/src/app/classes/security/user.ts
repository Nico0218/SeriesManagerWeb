import { LogicModelBase } from '../Models/logic-model-base';
import { UserRoles } from '../../enums/security/user-roles';
export class User extends LogicModelBase{
    password: string;
    role: UserRoles;
    token: string;
}