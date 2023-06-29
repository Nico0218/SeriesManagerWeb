import { AlertColor } from '@mui/material/Alert/Alert';

export default interface SnackBarPayload {
	state: boolean;
	message: string;
	severity?: AlertColor | undefined;
}
