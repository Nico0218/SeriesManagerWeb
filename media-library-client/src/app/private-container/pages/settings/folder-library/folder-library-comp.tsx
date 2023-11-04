import { Box } from '@mui/material';
import FolderType from '../../../../enums/folder-type';
import ObjectStatus from '../../../../enums/object-status';
import IconButtonWrapper from '../../../../custom-components/icon-button-wrapper/icon-button-wrapper';
import IconSelector from '../../../../custom-components/icon-loader/icon-selector';
import ValidatedDropdown from '../../../../custom-components/inputs/validated-dropdown/validated-dropdown';
import ValidatedNumber from '../../../../custom-components/inputs/validated-number/validated-number';
import ValidatedTextField from '../../../../custom-components/inputs/validated-text/validated-text';
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
}: FolderLibraryCompProps) {
	const onFolderDelete = () => {
		setFolderLocations(prevState => {
			const temp = [...prevState];
			temp[index].status = ObjectStatus.Deleted;
			return temp;
		});
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
						temp[index].name = value;
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
						temp[index].basePath = value;
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
						if (typeof value === 'number') {
							temp[index].fileType = value;
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
						temp[index].minFreeSpace = value;
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
