import { Box } from '@mui/material';
import FolderLibrary from '../../../../classes/folder-library';
import IconButtonWrapper from '../../../../custom-components/icon-button-wrapper/icon-button-wrapper';
import IconSelector from '../../../../custom-components/icon-loader/icon-selector';
import ValidatedDropdown from '../../../../custom-components/inputs/validated-dropdown/validated-dropdown';
import ValidatedNumber from '../../../../custom-components/inputs/validated-number/validated-number';
import ValidatedTextField from '../../../../custom-components/inputs/validated-text/validated-text';
import FolderType from '../../../../enums/folder-type';
import ObjectStatus from '../../../../enums/object-status';
import enumToDropDownItems from '../../../../functions/enum-to-drop-down-items';
import FolderLibraryCompProps from './folder-library-comp-props';

export default function FolderLibraryComp({
	folderLocation,
	setFolderLocations,
	index,
	formState,
	setFormState,
	onSave,
	formID,
}: Readonly<FolderLibraryCompProps>) {
	const onFolderDelete = () => {
		setFolderLocations(prevState => {
			const temp = [...prevState];
			temp[index].status = ObjectStatus.Deleted;
			return temp;
		});
	};

	const setObjectState = (temp: FolderLibrary[]) => {
		if (temp[index].status === ObjectStatus.None) {
			temp[index].status = ObjectStatus.Modified;
		}
	};

	return (
		<Box sx={{ display: 'flex', alignItems: 'center' }}>
			<ValidatedTextField
				id={`folder-name-${index}`}
				label={'Folder Name'}
				formState={formState}
				setFormState={setFormState}
				formID={formID}
				value={folderLocation.name}
				onChange={value => {
					setFolderLocations(prevState => {
						const temp = [...prevState];
						if (temp[index].name !== value) {
							temp[index].name = value;
							setObjectState(temp);
						}
						return temp;
					});
				}}
				isRequired
				onEnterPress={onSave}
				minLength={3}
				maxLength={255}
			/>
			<ValidatedTextField
				id={`folder-directory-${index}`}
				label={'Folder Directory'}
				formState={formState}
				setFormState={setFormState}
				formID={formID}
				value={folderLocation.basePath}
				onChange={value => {
					setFolderLocations(prevState => {
						const temp = [...prevState];
						if (temp[index].basePath !== value) {
							temp[index].basePath = value;
							setObjectState(temp);
						}
						return temp;
					});
				}}
				isRequired
				onEnterPress={onSave}
				minLength={3}
			/>
			<ValidatedDropdown
				values={enumToDropDownItems(FolderType)}
				id={`folder-type-${index}`}
				label={'Folder Type'}
				value={folderLocation.fileType}
				onChange={value => {
					setFolderLocations(prevState => {
						const temp = [...prevState];
						if (typeof value === 'number' && temp[index].fileType !== value) {
							temp[index].fileType = value;
							setObjectState(temp);
						}
						return temp;
					});
				}}
				isRequired
				onEnterPress={onSave}
			/>
			<ValidatedNumber
				id={`minimum-free-space-${index}`}
				label={'Minimum-Free-Space'}
				formState={formState}
				setFormState={setFormState}
				formID={formID}
				value={folderLocation.minFreeSpace}
				onChange={value => {
					setFolderLocations(prevState => {
						const temp = [...prevState];
						if (temp[index].minFreeSpace !== value) {
							temp[index].minFreeSpace = value;
							setObjectState(temp);
						}
						return temp;
					});
				}}
				minValue={0}
				maxValue={50}
				isRequired
				onEnterPress={onSave}
			/>
			<IconButtonWrapper id={'remove-folder'} icon={IconSelector.Delete} onClick={onFolderDelete} />
		</Box>
	);
}
