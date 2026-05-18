// ESLint 10 flat config.
// Binding constraint: all plugins (lit, wc, lit-a11y) support ESLint >= 8; pinned to ESLint 10 (latest stable).
import tseslint from 'typescript-eslint';
import lit from 'eslint-plugin-lit';
import wc from 'eslint-plugin-wc';
import litA11y from 'eslint-plugin-lit-a11y';

export default tseslint.config(
  {
    ignores: ['dist/', 'node_modules/'],
  },
  ...tseslint.configs.recommended,
  {
    plugins: { lit, wc, 'lit-a11y': litA11y },
    rules: {
      ...lit.configs.recommended.rules,
      ...wc.configs['flat/recommended'].rules,
      ...litA11y.configs.recommended.rules,
    },
  },
);
