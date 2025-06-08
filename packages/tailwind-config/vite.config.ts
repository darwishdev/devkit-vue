import { defineConfig } from 'vite';
import path from 'node:path'
export default defineConfig({
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
			entry: './src/index.ts', 
			name: 'devkit-tailwindconfig', 
			fileName: (format) => `index.${format}.js`, 
			formats: ['es'],
		},
		rollupOptions: {
			external: [
				'tailwindcss',
				'tailwindcss-primeui',
			],
		},
	},
});
