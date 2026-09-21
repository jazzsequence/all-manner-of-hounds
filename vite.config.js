import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	// Served from a project page on GitHub Pages, so assets need the repo prefix.
	base: process.env.BASE_PATH ?? '/',
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./src/test/setup.js'],
		include: ['src/**/*.test.{js,jsx}', 'scripts/**/*.test.mjs'],
	},
});
