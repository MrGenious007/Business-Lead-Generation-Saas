import nextVitals from 'eslint-config-next/core-web-vitals';

export default [
  ...nextVitals,
  {
    ignores: ['.next/**', 'node_modules/**', 'DOC/**', 'supabase/**'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: ['../*', '../../*', '../../../*', '../../../../*'],
        },
      ],
    },
  },
];
