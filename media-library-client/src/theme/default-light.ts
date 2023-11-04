import { createTheme } from '@mui/material';
import { mainAppBarHeight } from '../app/constants';
declare module '@mui/material/styles' {
	interface TypographyVariants {
		display: React.CSSProperties;
		labelLarge: React.CSSProperties;
		labelMedium: React.CSSProperties;
		labelStrong: React.CSSProperties;
		labelSmall: React.CSSProperties;
		bodyLarge: React.CSSProperties;
		bodyStrong: React.CSSProperties;
		bodyMedium: React.CSSProperties;
		bodySmall: React.CSSProperties;
		stepText: React.CSSProperties;
	}
	// allow configuration using `createTheme`
	interface TypographyVariantsOptions {
		display?: React.CSSProperties;
		labelLarge?: React.CSSProperties;
		labelMedium?: React.CSSProperties;
		labelStrong?: React.CSSProperties;
		labelSmall?: React.CSSProperties;
		bodyLarge?: React.CSSProperties;
		bodyStrong?: React.CSSProperties;
		bodyMedium?: React.CSSProperties;
		bodySmall?: React.CSSProperties;
		stepText?: React.CSSProperties;
	}
}

declare module '@mui/material/Typography' {
	interface TypographyPropsVariantOverrides {
		display: true;
		labelLarge: true;
		labelMedium: true;
		labelStrong: true;
		labelSmall: true;
		bodyLarge: true;
		bodyStrong: true;
		bodyMedium: true;
		bodySmall: true;
		stepText: true;
	}
}

declare module '@mui/material/styles/createPalette' {
	interface CommonColors {
		custom: {
			iHubBlue: string;
			navActiveBackground: string;
			componentBackground: string;
			stepperBackground: string;
			warningBackground: string;
			errorBackground: string;
			linkText: string;
		};
	}
}

//https://zenoo.github.io/mui-theme-creator/
export const defaultLightTheme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			100: '#E4E9FF',
			200: '#DAE0FF',
			300: '#CFD7FF',
			400: '#BFC9FF',
			500: '#B0BDFF',
			600: '#A4B1F8',
			700: '#98A7F5',
			800: '#899AF3',
			900: '#6E8CF7',
			main: '#B0BDFF',
			light: 'rgb(191, 202, 255)',
			dark: 'rgb(123, 132, 178)',
			contrastText: 'rgba(0, 0, 0, 0.87)',
		},
		divider: '#E7EBF0',
		common: {
			black: '#000000',
			white: '#ffffff',
			custom: {
				iHubBlue: '#3D4157',
				navActiveBackground: '#545A79',
				componentBackground: '#EDEDED',
				stepperBackground: '#DFDBD9',
				warningBackground: 'rgba(241, 169, 103, 0.06)',
				errorBackground: 'rgba(232, 78, 98, 0.06)',
				linkText: '#3A55E2',
			},
		},
		text: {
			primary: '#343749',
			secondary: '#373737',
			disabled: 'rgba(0, 0, 0, 0.38)',
		},
		grey: {
			50: '#F3F6F9',
			100: '#E7EBF0',
			200: '#FAFAFA',
			300: '#F5F5F5',
			400: '#B2BAC2',
			500: '#A0AAB4',
			600: '#6F7E8C',
			700: '#3E5060',
			800: '#2D3843',
			900: '#434343',
			A100: '#343749',
			A200: '#1F1F1F',
			A400: '#141414',
			A700: '#616161',
		},
		error: {
			50: '#FFF0F1',
			100: '#FFDBDE',
			200: '#FFBDC2',
			300: '#FF99A2',
			400: '#FF7A86',
			500: '#E84E62',
			600: '#EB0014',
			700: '#C70011',
			800: '#94000D',
			900: '#570007',
			main: '#E84E62',
			light: '#FF99A2',
			dark: '#C70011',
			contrastText: '#fff',
		},
		success: {
			50: '#E9FBF0',
			100: '#C6F6D9',
			200: '#9AEFBC',
			300: '#6AE79C',
			400: '#3EE07F',
			500: '#59A089',
			600: '#1DB45A',
			700: '#1AA251',
			800: '#178D46',
			900: '#0F5C2E',
			main: '#59A089',
			light: '#6AE79C',
			dark: '#1AA251',
			contrastText: '#fff',
		},
		warning: {
			50: '#FFF9EB',
			100: '#FFF3C1',
			200: '#FFECA1',
			300: '#FFDC48',
			400: '#F4C000',
			500: '#F1A967',
			600: '#D18E00',
			700: '#AB6800',
			800: '#8C5800',
			900: '#5A3600',
			main: '#F1A967',
			light: '#FFDC48',
			dark: '#AB6800',
			contrastText: 'rgba(0, 0, 0, 0.87)',
		},
		secondary: {
			main: '#9c27b0',
			light: '#ba68c8',
			dark: '#7b1fa2',
			contrastText: '#fff',
		},
		info: {
			main: '#0288d1',
			light: '#03a9f4',
			dark: '#01579b',
			contrastText: '#fff',
		},
		contrastThreshold: 3,
		tonalOffset: 0.2,
		background: {
			default: '#efecea',
			paper: '#fff',
		},
		action: {
			active: 'rgba(0, 0, 0, 0.54)',
			hover: 'rgba(0, 0, 0, 0.04)',
			hoverOpacity: 0.04,
			selected: 'rgba(0, 0, 0, 0.08)',
			selectedOpacity: 0.08,
			disabled: 'rgba(0, 0, 0, 0.26)',
			disabledBackground: 'rgba(0, 0, 0, 0.12)',
			disabledOpacity: 0.38,
			focus: 'rgba(0, 0, 0, 0.12)',
			focusOpacity: 0.12,
			activatedOpacity: 0.12,
		},
	},
	typography: {
		fontFamily: 'Inter',
		// DISPLAY
		display: {
			fontWeight: 400,
			fontSize: '2.25rem',
			lineHeight: '2.75rem',
		},
		// HEADLINE LARGE
		h1: {
			fontWeight: 400,
			fontSize: '2rem',
			lineHeight: '2.5rem',
		},
		// HEADLINE MEDIUM
		h2: {
			fontWeight: 400,
			fontSize: '1.75rem',
			lineHeight: '2.25rem',
		},
		// HEADLINE SMALL
		h3: {
			fontWeight: 400,
			fontSize: '1.5rem',
			lineHeight: '2rem',
		},
		// TITLE LARGE
		h4: {
			fontWeight: 500,
			fontSize: '1.375rem',
			lineHeight: '1.75rem',
		},
		// TITLE MEDIUM
		h5: {
			fontWeight: 500,
			fontSize: '1rem',
			lineHeight: '1.5rem',
			letterSpacing: '0.009rem',
		},
		// TITLE SMALL
		h6: {
			fontWeight: 500,
			fontSize: '0.875rem',
			lineHeight: '1.25rem',
			letterSpacing: '0.006',
		},
		// LABEL LARGE
		labelLarge: {
			fontWeight: 400,
			fontSize: '0.875rem',
			lineHeight: '1.25rem',
			letterSpacing: '0.006rem',
		},
		// LABEL MEDIUM
		labelMedium: {
			fontWeight: 500,
			fontSize: '0.75rem',
			lineHeight: '1rem',
		},
		// LABEL STRONG
		labelStrong: {
			fontWeight: 700,
			fontSize: '0.688rem',
			lineHeight: '1rem',
		},
		// LABEL SMALL
		labelSmall: {
			fontWeight: 400,
			fontSize: '0.625rem',
			lineHeight: '1rem',
		},
		// BODY LARGE
		bodyLarge: {
			fontWeight: 400,
			fontSize: '1rem',
			lineHeight: '1.5rem',
			letterSpacing: '0.031rem',
		},
		// BODY STRONG
		bodyStrong: {
			fontWeight: 700,
			fontSize: '0.875rem',
			lineHeight: '1.375rem',
			letterSpacing: '0.009rem',
		},
		// BODY MEDIUM
		bodyMedium: {
			fontWeight: 500,
			fontSize: '0.875rem',
			lineHeight: '1.375rem',
			letterSpacing: '0.009rem',
		},
		// BODY SMALL
		bodySmall: {
			fontWeight: 500,
			fontSize: '0.75rem',
			lineHeight: '1.25rem',
			letterSpacing: '0.063rem',
		},
		// CAPTION
		caption: {
			fontWeight: 400,
			fontSize: '0.75rem',
			lineHeight: '1rem',
			letterSpacing: '0.025rem',
		},
		// BUTTON
		button: {
			fontWeight: 500,
			fontSize: '0.875rem',
			lineHeight: '0.875rem',
			letterSpacing: '0.006',
		},
		// STEP TEXT
		stepText: {
			fontWeight: 400,
			fontSize: '0.563rem',
			lineHeight: '0.844rem',
		},
	},
	components: {
		MuiAppBar: {
			styleOverrides: {
				root: {
					backgroundColor: '#D9D4D1',
					backgroundImage: 'none',
				},
			},
		},
		MuiDrawer: {
			styleOverrides: {
				paper: {
					backgroundColor: '#3D4157',
				},
			},
		},
		MuiCssBaseline: {
			styleOverrides: {
				body: {
					'div#root': {
						height: '100vh',
						display: 'flex',
						overflow: 'hidden',
					},
					'header.MuiPaper-root': {
						minHeight: `${mainAppBarHeight}px`,
						maxHeight: `${mainAppBarHeight}px`,
					},
					'div.MuiToolbar-root.Drawer-Toolbar': {
						minHeight: `${mainAppBarHeight}px`,
						maxHeight: `${mainAppBarHeight}px`,
					},
					'div.MuiGrid-root.MuiGrid-container': {
						marginLeft: 0,
						marginTop: 0,
						paddingRight: 16,
					},
					'div.MuiFormControl-root.MuiTextField-root': {
						margin: '0px',
						width: '100%',
					},
					scrollbarColor: '#6b6b6b #2b2b2b',
					'&::-webkit-scrollbar, & *::-webkit-scrollbar': {
						backgroundColor: '#2b2b2b',
					},
					'&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
						borderRadius: 8,
						backgroundColor: '#6b6b6b',
						minHeight: 24,
						border: '3px solid #2b2b2b',
					},
					'&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
						backgroundColor: '#959595',
					},
					'&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
						backgroundColor: '#959595',
					},
					'&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
						backgroundColor: '#959595',
					},
					'&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
						backgroundColor: '#2b2b2b',
					},
					'a.react-link': {
						color: 'inherit',
						textDecoration: 'none',
					},
					'a.react-link:hover': {
						textDecoration: 'underline',
					},
				},
			},
		},
	},
});
