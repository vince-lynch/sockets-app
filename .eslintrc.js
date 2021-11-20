module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true
  },
  extends: [
    'airbnb-base',
    'plugin:cypress/recommended',
    'plugin:jsdoc/recommended',
    'plugin:prettier/recommended',
    'plugin:promise/recommended',
    'plugin:regexp/recommended',
    'plugin:yml/recommended'
  ],
  plugins: ['const-case', 'jsdoc', 'markdown', 'no-loops', 'promise'],
  rules: {
    'capitalized-comments': ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    'const-case/uppercase': 'error',
    'import/extensions': ['error', 'ignorePackages'],
    'import/prefer-default-export': 'off',
    'jsdoc/require-returns': 'off',
    'jsdoc/no-undefined-types': 'off',
    'multiline-comment-style': ['error', 'starred-block'],
    'no-inline-comments': [
      'error',
      { ignorePattern: '\\*\\s@type\\s\\{.+\\}' }
    ],
    'no-loops/no-loops': 'error',
    'spaced-comment': ['error', 'always'],
    semi: ['error', 'never']
  }
}
