import { snackBarStorageKey } from '../constants';
import SnackBarPayload from '../custom-components/snackbar-wrapper/snack-bar-payload';

export default function dispatchSnackbar(snackBarPayload: SnackBarPayload) {
	window.localStorage.setItem(snackBarStorageKey, JSON.stringify(snackBarPayload));
	window.dispatchEvent(new Event(`${snackBarStorageKey}-event`));
}
