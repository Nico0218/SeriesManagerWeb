import { AlertColor } from '@mui/material/Alert/Alert';

export default interface SnackBarPayload {
	message: string;
	severity?: AlertColor | undefined;
}
