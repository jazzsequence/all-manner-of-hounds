import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
	{ ignores: ['dist/**', 'node_modules/**'] },
	js.configs.recommended,
	{
		files: ['**/*.{js,jsx,mjs}'],
		languageOptions: {
			ecmaVersion: 2023,
			sourceType: 'module',
			globals: { ...globals.browser, ...globals.node },
			parserOptions: { ecmaFeatures: { jsx: true } },
		},
	},
	{
		files: ['src/**/*.jsx'],
		...react.configs.flat.recommended,
		...reactHooks.configs.flat['recommended-latest'],
		plugins: {
			...react.configs.flat.recommended.plugins,
			...reactHooks.configs.flat['recommended-latest'].plugins,
		},
		rules: {
			...react.configs.flat.recommended.rules,
			...reactHooks.configs.flat['recommended-latest'].rules,
			// The new JSX transform means React need not be in scope.
			'react/react-in-jsx-scope': 'off',
			'react/prop-types': 'off',
		},
		settings: { react: { version: 'detect' } },
	},
	{
		files: ['**/*.test.{js,jsx,mjs}', 'src/test/**'],
		languageOptions: { globals: globals.vitest },
	},
];
