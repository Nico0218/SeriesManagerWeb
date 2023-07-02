import { CacheProvider } from '@emotion/react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { QueryClientProvider } from '@tanstack/react-query';
import { Suspense, useMemo, useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import availableThemes from 'src/theme/available-themes';
import LoadingComponent from './custom-components/loading-component/loading-component';
import SnackbarWrapper from './custom-components/snackbar-wrapper/snackbar-wrapper';
import AvailableThemes from './custom-components/theme-selector/available-themes-type';
import GlobalAppContext from './global-app-context';
import privateRoutes from './routes/private-routes';
import publicRoutes from './routes/public-routes';
import createEmotionCache from './utils/create-emotion-cache';
import QueryClientWrapper from './utils/create-query-client';

export default function App() {
	const themeKey = 'Theme';
	const [theme, setTheme] = useState<AvailableThemes>(
		(localStorage.getItem(themeKey) ?? 'defaultDarkTheme') as AvailableThemes
	);
	const emotionCache = createEmotionCache();
	useMemo(() => {
		if (theme) {
			localStorage.setItem(themeKey, theme);
		}
	}, [theme]);

	const muiTheme = useMemo(() => {
		if (theme) {
			return createTheme(availableThemes[theme]);
		}
		return createTheme(availableThemes['defaultDarkTheme']);
	}, [theme]);

	const router = createBrowserRouter([...privateRoutes, ...publicRoutes]);
	return (
		<GlobalAppContext.Provider
			value={{
				theme: theme,
				setTheme: setTheme,
			}}
		>
			<QueryClientProvider client={QueryClientWrapper.queryClient}>
				<ThemeProvider theme={muiTheme}>
					<CacheProvider value={emotionCache}>
						<LocalizationProvider dateAdapter={AdapterLuxon}>
							<CssBaseline />
							<Suspense fallback={<LoadingComponent />}>
								<RouterProvider router={router} />
							</Suspense>
							<SnackbarWrapper />
						</LocalizationProvider>
					</CacheProvider>
				</ThemeProvider>
			</QueryClientProvider>
		</GlobalAppContext.Provider>
	);
}
