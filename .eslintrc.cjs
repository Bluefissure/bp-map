/* eslint-env node */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
  ],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  ignorePatterns: [".eslintrc.cjs", "**/node_modules/*.js"],
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  root: true,
};