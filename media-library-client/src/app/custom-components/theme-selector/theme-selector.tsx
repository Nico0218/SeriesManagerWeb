import { Autocomplete, Box, TextField } from '@mui/material';
import { useContext } from 'react';
import GlobalAppContext from '../../../app/global-app-context';
import availableThemes from '../../../theme/available-themes';
import AvailableThemes from './available-themes-type';

// https://mui.com/material-ui/customization/theming/
export default function ThemeSelector() {
	const { theme, setTheme } = useContext(GlobalAppContext);
	return (
		<Box
			sx={{
				marginRight: 1,
				backgroundColor: theme =>
					theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
			}}
		>
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
