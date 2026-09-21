import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	// Served from the custom domain's root, so '/' is right. BASE_PATH stays
	// as an override for anyone building for a /<repo>/ project-page subpath
	// instead (e.g. previewing without the custom domain).
	base: process.env.BASE_PATH ?? '/',
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./src/test/setup.js'],
		include: ['src/**/*.test.{js,jsx}', 'scripts/**/*.test.mjs'],
	},
});
