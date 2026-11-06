import { generateEslintConfig } from '@companion-module/tools/eslint/config.mjs'

export default [
	...(await generateEslintConfig({
		enableTypescript: true,
	})),
	{
		files: ['**/*.ts', '**/*.cts', '**/*.mts'],
		languageOptions: {
			parserOptions: {
				// The project service resolves the tsconfig for each file; the plain `project: true`
				// lookup used by the shared config does not attach type information here.
				project: false,
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
]
