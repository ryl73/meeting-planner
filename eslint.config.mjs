import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,

    {
        files: ['**/*.{ts,tsx,js,jsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
        },
        rules: {
            '@typescript-eslint/ban-ts-comment': 1,
            'react-hooks/exhaustive-deps': 'warn',
            'react-hooks/rules-of-hooks': 'warn',
            '@typescript-eslint/no-require-imports': 0,
        },
    },

    // Override default ignores of eslint-config-next.
    globalIgnores([
        // Default ignores of eslint-config-next:
        'packages/client/.next/**',
        'packages/client/out/**',
        'packages/client/build/**',
        'packages/client/next-env.d.ts',
    ]),
]);

export default eslintConfig;
