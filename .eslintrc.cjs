/* eslint-env node */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
  ],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  ignorePatterns: [
    ".eslintrc.cjs",
    "tailwind.config.js",
    'webpack.config.js',
    'postcss.config.js',
    "**/node_modules/*.js"
  ],
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  rules: {
    indent: ['error', 4, {
      'SwitchCase': 1,
      'offsetTernaryExpressions': true
    }]
  },
  root: true,
};