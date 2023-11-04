import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useEffect, useState } from 'react';
import { snackBarStorageKey } from '../../constants';
import { addLocalStorageEventListener, getLocalStorageItem } from '../../functions/local-storage';
import IconButtonWrapper from '../icon-button-wrapper/icon-button-wrapper';
import IconSelector from '../icon-loader/icon-selector';
import SnackBarPayload from './snack-bar-payload';

export default function SnackbarWrapper() {
	const [snackBarPayload, setSnackBarPayload] = useState<SnackBarPayload>({
		message: '',
	});
	const [visible, setVisible] = useState<boolean>(false);

	useEffect(() => {
		addLocalStorageEventListener(snackBarStorageKey, () => {
			const localData = getLocalStorageItem<SnackBarPayload>(snackBarStorageKey);
			if (localData) {
				setSnackBarPayload(localData);
				setVisible(true);
			}
		});
	}, []);

	const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}

		const temp = { ...snackBarPayload };
		setVisible(false);
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
			open={visible}
			autoHideDuration={snackBarPayload.severity === 'error' ? 5000 : 2000}
			onClose={handleClose}
			action={action}
			sx={{ zIndex: 1500 }}
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
