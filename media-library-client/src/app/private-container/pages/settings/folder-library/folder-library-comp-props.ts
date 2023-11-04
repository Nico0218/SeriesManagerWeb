import { Dispatch, SetStateAction } from 'react';
import FolderLibrary from '../../../../classes/folder-library';
import FormValidator from '../../../../custom-components/inputs/form-validator';

export default interface FolderLibraryCompProps {
	folderLocation: FolderLibrary;
	setFolderLocations: Dispatch<SetStateAction<FolderLibrary[]>>;
	index: number;
	formState: FormValidator;
	setFormState: Dispatch<SetStateAction<FormValidator>>;
	onSave: () => void;
	formID: string;
}
