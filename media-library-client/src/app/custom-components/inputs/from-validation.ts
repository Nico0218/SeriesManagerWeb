import { IInputValidation } from './input-validation';

export default class FormValidation {
	formID: string;
	isDirty = false;
	inputs: IInputValidation[] = [];

	constructor(formID: string, isDirty?: boolean) {
		this.formID = formID;
		if (isDirty) {
			this.isDirty = isDirty;
		}
	}

	IsValid() {
		for (const input of this.inputs) {
			if (!input.isValid) {
				return false;
			}
		}
		return true;
	}
}
