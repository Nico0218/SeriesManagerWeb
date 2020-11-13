import { LogicModelBase } from '../Models/logic-model-base';
import { FolderType } from '../../enums/config/folder-type';

export class FolderLibrary extends LogicModelBase {
    public fileType: FolderType;
    public basePath: string;
    public minFreeSpace: number;
}