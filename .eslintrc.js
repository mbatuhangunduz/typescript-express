module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
    mocha: true,
    mongo: true,
  },
  extends: ['plugin:prettier/recommended', 'airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  root: true,
  rules: {
    camelcase: 'warn',
    'comma-dangle': ['warn', 'never'],
    // "comma-dangle": ["error", {
    //     "arrays": "never",
    //     "objects": "never",
    //     "imports": "never",
    //     "exports": "never",
    //     "functions": "never"
    // }],
    'max-len': [
      'error',
      {
        code: 128,
        ignoreComments: true,
        ignoreStrings: true,
        ignoreUrls: true,
      },
    ],
    'no-multiple-empty-lines': [
      'warn',
      {
        max: 2,
        // "maxEOF": 0
      },
    ],
    'no-param-reassign': ['error', { props: false }],
    'no-plusplus': 'warn',
    // "no-underscore-dangle": "warn",
    'no-underscore-dangle': ['error', { allow: ['_id', '_bar'] }],
    'no-unused-vars': 'warn',
  },
};
