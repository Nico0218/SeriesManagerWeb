import { Dispatch, SetStateAction } from 'react';
import CustomValidationResult from './custom-validation-result';
import FormValidator from './form-validator';

export default interface IInputValidationProps<T> {
	isRequired?: boolean;
	customValidation?: (value?: T) => CustomValidationResult;
	formState?: FormValidator;
	setFormState?: Dispatch<SetStateAction<FormValidator>>;
	formID?: string;
}
