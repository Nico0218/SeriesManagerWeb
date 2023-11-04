/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	cacheDir: './node_modules/.vite/media-library-client',

	server: {
		port: 4200,
		host: true,
		strictPort: true,
		hmr: true,
		watch: {
			usePolling: true,
			interval: 1000,
		},
	},

	preview: {
		port: 4300,
		host: 'localhost',
	},

	plugins: [
		react(),
		viteTsConfigPaths({
			root: './',
		}),
	],
	build: {},
	esbuild: {
		minifyIdentifiers: false,
		keepNames: true,
	},

	// Uncomment this if you are using workers.
	// worker: {
	//  plugins: [
	//    viteTsConfigPaths({
	//      root: './',
	//    }),
	//  ],
	// },

	test: {
		globals: true,
		cache: {
			dir: './node_modules/.vitest',
		},
		environment: 'jsdom',
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
	},
});
