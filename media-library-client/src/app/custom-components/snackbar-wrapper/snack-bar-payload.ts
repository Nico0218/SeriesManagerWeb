import { AlertColor } from '@mui/material/Alert/Alert';

export default interface SnackBarPayload {
	open: boolean;
	message: string;
	severity?: AlertColor | undefined;
}
