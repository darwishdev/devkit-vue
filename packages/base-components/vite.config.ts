import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path'
import dts from 'vite-plugin-dts'; // Plugin to generate .d.ts files
export default defineConfig({
	plugins: [
		vue(),
		dts({
			insertTypesEntry: true,
			outDir: 'dist/types',
		}),
	],
	css: {
		postcss: './postcss.config.js',
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src') // Define @ as src directory
		}
	},
	build: {
		cssCodeSplit: true,
		lib: {
			entry: './src/index.ts', // Entry point for your library
			name: 'VueDevkit', // Global variable name for your library
			fileName: (format) => `index.${format}.js`, // Output file name
			formats: ['es'], // Only output ESM format
		},
		rollupOptions: {
			external: [
				'vue',
				"@devkit/apiclient",
				'dexie',
				'tailwindcss',
				'tailwindcss-primeui',
				'vue-i18n',
				'vue-router'
			],
			// Externalize Vue
			output: {
				globals: {
					vue: 'Vue',
					primevue: 'Primevue',
					'vue-router': 'VueRouter',
				},
			},
		},
	},
});
