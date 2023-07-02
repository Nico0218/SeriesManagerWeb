import { Autocomplete, Box, SxProps, TextField, Theme } from '@mui/material';
import { useContext } from 'react';
import GlobalAppContext from '../../../app/global-app-context';
import availableThemes from '../../../theme/available-themes';
import AvailableThemes from './available-themes-type';
import ThemeSelectorProps from './theme-selector-props';

// https://mui.com/material-ui/customization/theming/
export default function ThemeSelector({ sx }: ThemeSelectorProps) {
	const { theme, setTheme } = useContext(GlobalAppContext);

	const defaultStyle: SxProps<Theme> = {
		marginRight: 1,
		backgroundColor: theme =>
			theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
	};

	return (
		<Box sx={sx ? { ...defaultStyle, ...sx } : defaultStyle}>
			<Autocomplete
				options={Object.keys(availableThemes)}
				style={{ width: 200, height: 50 }}
				value={theme}
				disableClearable
				onChange={(event: any, newValue: string | null) => {
					if (setTheme) {
						setTheme(newValue as AvailableThemes);
					}
				}}
				renderInput={params => (
					<TextField {...params} label={'Theme'} variant="standard" fullWidth />
				)}
			/>
		</Box>
	);
}
