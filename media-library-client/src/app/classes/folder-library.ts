import FolderType from '../enums/folder-type';
import ObjectStatus from '../enums/object-status';
import Guid from '../functions/guid';
import LogicModelBase from '../interfaces/logic-model-base';

export default class FolderLibrary implements LogicModelBase {
	id: string = Guid();
	name = '';
	displayName = '';
	status = ObjectStatus.None;
	fileType = FolderType.UnknownFile;
	basePath = '';
	minFreeSpace = 0;

	constructor(init?: Partial<FolderLibrary>) {
		if (init) {
			Object.assign(this, init);
		}
	}
}