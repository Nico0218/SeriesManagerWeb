import ObjectStatus from '../enums/object-status';

export default interface LogicModelBase {
	id: string;
	name: string;
	displayName: string;
	status: ObjectStatus;
}
