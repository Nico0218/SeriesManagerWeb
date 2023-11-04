import { Box, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import FormValidation from 'src/app/custom-components/inputs/from-validation';
import FolderType from 'src/enums/folder-type';
import ObjectStatus from '../../../../enums/object-status';
import FolderLibrary from '../../../classes/folder-library';
import IconButtonWrapper from '../../../custom-components/icon-button-wrapper/icon-button-wrapper';
import IconSelector from '../../../custom-components/icon-loader/icon-selector';
import FormValidator from '../../../custom-components/inputs/form-validator';
import { AddBreadCrumbItem } from '../../../functions/bread-crumb-functions';
import AppRoutes from '../../../routes/app-routes';
import FolderLibraryComp from './folder-library/folder-library-comp';

export default function FolderLocations() {
	const [folderLocations, setFolderLocations] = useState<FolderLibrary[]>([
		new FolderLibrary({ name: 'Image Files', fileType: FolderType.ImageFile, minFreeSpace: 5 }),
		new FolderLibrary({ name: 'Image Rejects', fileType: FolderType.ImageReject, minFreeSpace: 5 }),
		new FolderLibrary({ name: 'Ingest', fileType: FolderType.Ingest, minFreeSpace: 5 }),
		new FolderLibrary({ name: 'Interim', fileType: FolderType.Interim, minFreeSpace: 5 }),
		new FolderLibrary({ name: 'Unknown Files', fileType: FolderType.UnknownFile, minFreeSpace: 5 }),
		new FolderLibrary({ name: 'Video Files', fileType: FolderType.VideoFile, minFreeSpace: 5 }),
		new FolderLibrary({ name: 'Video Rejects', fileType: FolderType.VideoReject, minFreeSpace: 5 }),
	]);
	const formID = 'FolderInput';
	const [formState, setFormState] = useState(new FormValidator([new FormValidation(formID, true)]));

	useEffect(() => {
		AddBreadCrumbItem({ label: 'Library Location', route: AppRoutes.FolderLocation });
	}, []);

	const onSave = () => {
		console.log(`onSave`);
	};

	const renderLocationConfigs = useMemo(() => {
		const components: React.JSX.Element[] = [];
		folderLocations
			.filter(x => x.status !== ObjectStatus.Deleted)
			.forEach((folderLocation, i) => {
				components.push(
					<FolderLibraryComp
						key={`${folderLocation.name}-container`}
						folderLocation={folderLocation}
						setFolderLocations={setFolderLocations}
						index={i}
						formState={formState}
						setFormState={setFormState}
						onSave={onSave}
						formID={formID}
					/>
				);
			});
		return components;
	}, [folderLocations]);

	return (
		<Box>
			<Box sx={{ display: 'flex', alignItems: 'center' }}>
				<Typography>Library Locations</Typography>
				<IconButtonWrapper id={'Add-Location'} icon={IconSelector.Add} label="Add Location" />
			</Box>
			{renderLocationConfigs}
			<IconButtonWrapper
				id={'remove-folder'}
				icon={IconSelector.Save}
				label="Save"
				disabled={!formState.IsValid()}
				onClick={onSave}
			/>
		</Box>
	);
}
