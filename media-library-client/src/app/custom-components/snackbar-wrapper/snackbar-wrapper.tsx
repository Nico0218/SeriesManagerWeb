import { Alert, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';
import { snackBarStorageKey } from '../../constants';
import { addLocalStorageEventListener, getLocalStorageItem } from '../../functions/local-storage';
import IconButtonWrapper from '../icon-button-wrapper/icon-button-wrapper';
import IconSelector from '../icon-loader/icon-selector';
import SnackBarPayload from './snack-bar-payload';

export default function SnackbarWrapper() {
	const [snackBarPayload, setSnackBarPayload] = useState<SnackBarPayload>({
		state: false,
		message: '',
	});

	useEffect(() => {
		addLocalStorageEventListener(snackBarStorageKey, () => {
			const localData = getLocalStorageItem<SnackBarPayload>(snackBarStorageKey);
			if (localData) {
				setSnackBarPayload(localData);
			}
		});
	}, []);

	const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}

		const temp = { ...snackBarPayload };
		temp.state = false;
		window.localStorage.removeItem(snackBarStorageKey);
		setSnackBarPayload(temp);
	};

	const action = (
		<IconButtonWrapper
			id="AddMapping"
			icon={IconSelector.Close}
			label="Add"
			size="small"
			onClick={e => {
				handleClose(e);
			}}
		/>
	);

	return (
		<Snackbar
			open={snackBarPayload.state}
			autoHideDuration={2000}
			onClose={handleClose}
			action={action}
		>
			<Alert
				onClose={handleClose}
				severity={snackBarPayload.severity ?? 'info'}
				sx={{ width: '100%' }}
			>
				{snackBarPayload.message}
			</Alert>
		</Snackbar>
	);
}
