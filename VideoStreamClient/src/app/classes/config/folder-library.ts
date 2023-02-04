import { LogicModelBase } from '../Models/logic-model-base';
import { FolderType } from '../../enums/config/folder-type';

export interface FolderLibrary extends LogicModelBase {
    fileType: FolderType;
    basePath: string;
    minFreeSpace: number;
}