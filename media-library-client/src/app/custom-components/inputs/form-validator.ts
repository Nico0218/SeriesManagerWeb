import FormValidation from './from-validation';

export default class FormValidator {
	forms: FormValidation[] = [];

	constructor(forms?: FormValidation[]) {
		if (forms) {
			this.forms = [...forms];
		}
	}

	IsFormDirty(formID: string) {
		const form = this.forms.find(x => x.formID === formID);
		if (form) {
			return form.isDirty;
		}
		return false;
	}

	IsValid() {
		for (const form of this.forms) {
			if (!form.IsValid()) {
				return false;
			}
		}
		return true;
	}

	private setInputState(form: FormValidation, inputID: string, isValid: boolean) {
		const input = form.inputs.find(x => x.inputID === inputID);
		if (input) {
			input.isValid = isValid;
		} else {
			form.inputs.push({ inputID, isValid });
		}
	}

	SetInputState(formID: string, inputID: string, isValid: boolean) {
		let form = this.forms.find(x => x.formID === formID);
		if (form) {
			this.setInputState(form, inputID, isValid);
			return;
		}
		form = new FormValidation(formID);
		this.setInputState(form, inputID, isValid);
		this.forms.push(form);
	}
}
