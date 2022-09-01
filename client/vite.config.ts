import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		minify: 'esbuild',
		target: 'esnext',
	},
	plugins: [react()],
	publicDir: 'public',
});
