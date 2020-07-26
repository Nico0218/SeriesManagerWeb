import { LogicModelBase } from '../Models/logic-model-base';
import { FolderType } from '../../enums/config/folder-type';
import { ObjectStatus } from '../../enums/config/object-status';

export class FolderLibrary extends LogicModelBase {
    fileType: FolderType;
    basePath: string;
    minFreeSpace;
    status: ObjectStatus;
}