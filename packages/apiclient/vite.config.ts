import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
	build: {
		lib: {
			entry: 'src/index.ts', // Set your entry file
			name: 'DevkitApiClient', // Global name for UMD builds
			formats: ['es', 'cjs'],
			fileName: (format) => `index.${format}.js`,
		},
	},
	plugins: [dts()],
});
