import { Dispatch, SetStateAction } from 'react';
import AvailableThemes from './custom-components/theme-selector/available-themes-type';

export default interface GlobalAppContextProps {
	theme?: AvailableThemes;
	setTheme?: Dispatch<SetStateAction<AvailableThemes>>;
}
