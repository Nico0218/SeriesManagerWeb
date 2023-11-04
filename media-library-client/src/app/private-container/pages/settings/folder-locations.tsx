import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useMemo, useState } from 'react';
import { unstable_useBlocker as useBlocker, useNavigate } from 'react-router-dom';
import HttpHelper from '../../../../app/classes/http-helper';
import FolderLibrary from '../../../classes/folder-library';
import IconButtonWrapper from '../../../custom-components/icon-button-wrapper/icon-button-wrapper';
import IconSelector from '../../../custom-components/icon-loader/icon-selector';
import FormValidator from '../../../custom-components/inputs/form-validator';
import FormValidation from '../../../custom-components/inputs/from-validation';
import FolderType from '../../../enums/folder-type';
import ObjectStatus from '../../../enums/object-status';
import { AddBreadCrumbItem } from '../../../functions/bread-crumb-functions';
import dispatchSnackbar from '../../../functions/dispatch-snackbar';
import { RouteFolderLocation } from '../../../routes/app-routes';
import FolderLibraryComp from './folder-library/folder-library-comp';

export default function FolderLocations() {
	const [folderLocations, setFolderLocations] = useState<FolderLibrary[]>([]);
	const [originalFolderData, setOriginalFolderData] = useState<string>('');
	const [changeFlag, setChangeFlag] = useState<boolean>(false);
	const blocker = useBlocker(changeFlag);
	const navigate = useNavigate();

	useEffect(() => {
		if (blocker.state === 'blocked' && blocker.location) {
			const res = window.confirm('You have unsaved changes. Are you sure you want to leave now?');
			if (res) {
				blocker.proceed();
				navigate(blocker.location.pathname);
			}
		}
	}, [blocker]);

	const getFoldersQuery = useQuery({
		...HttpHelper.config.GetFolders(),
		enabled: true,
	});

	useEffect(() => {
		if (getFoldersQuery.isSuccess && getFoldersQuery.data) {
			let folderData;
			if (getFoldersQuery.data.length === 0) {
				folderData = [
					new FolderLibrary({
						name: 'Image Files',
						fileType: FolderType.ImageFile,
						minFreeSpace: 5,
						status: ObjectStatus.Created,
					}),
					new FolderLibrary({
						name: 'Image Rejects',
						fileType: FolderType.ImageReject,
						minFreeSpace: 5,
						status: ObjectStatus.Created,
					}),
					new FolderLibrary({
						name: 'Ingest',
						fileType: FolderType.Ingest,
						minFreeSpace: 5,
						status: ObjectStatus.Created,
					}),
					new FolderLibrary({
						name: 'Interim',
						fileType: FolderType.Interim,
						minFreeSpace: 5,
						status: ObjectStatus.Created,
					}),
					new FolderLibrary({
						name: 'Unknown Files',
						fileType: FolderType.UnknownFile,
						minFreeSpace: 5,
						status: ObjectStatus.Created,
					}),
					new FolderLibrary({
						name: 'Video Files',
						fileType: FolderType.VideoFile,
						minFreeSpace: 5,
						status: ObjectStatus.Created,
					}),
					new FolderLibrary({
						name: 'Video Rejects',
						fileType: FolderType.VideoReject,
						minFreeSpace: 5,
						status: ObjectStatus.Created,
					}),
				];
			} else {
				folderData = getFoldersQuery.data;
			}
			setOriginalFolderData(JSON.stringify(folderData));
			setFolderLocations(getFoldersQuery.data);
		} else {
			setFolderLocations([]);
		}
	}, [getFoldersQuery.status, getFoldersQuery.data]);

	const formID = 'FolderInput';
	const [formState, setFormState] = useState(new FormValidator([new FormValidation(formID, true)]));

	useEffect(() => {
		if (
			!changeFlag &&
			originalFolderData !== '' &&
			JSON.stringify(folderLocations) !== originalFolderData
		) {
			setChangeFlag(true);
		}
	}, [folderLocations]);

	useEffect(() => {
		AddBreadCrumbItem({ label: 'Library Location', route: RouteFolderLocation() });
	}, []);

	const addFolderLocation = () => {
		setFolderLocations(prevState => {
			const temp = [...prevState];
			temp.push(new FolderLibrary({ status: ObjectStatus.Created }));
			return temp;
		});
	};

	const onSave = () => {
		HttpHelper.config.SaveFolders(folderLocations, {
			success: () => {
				dispatchSnackbar({
					message: `Saved configured folders.`,
					severity: 'error',
				});
			},
		});
	};

	const renderLocationConfigs = useMemo(() => {
		const components: React.JSX.Element[] = [];
		folderLocations
			.filter(x => x.status !== ObjectStatus.Deleted)
			.forEach((folderLocation, i) => {
				components.push(
					<FolderLibraryComp
						key={`${folderLocation.id}-container`}
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
				<IconButtonWrapper
					id={'Add-Location'}
					icon={IconSelector.Add}
					label="Add Location"
					onClick={addFolderLocation}
				/>
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
