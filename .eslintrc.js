const ts = {
  files: [
    '**/*.ts'
  ],

  rules: {
    // this needs to be off because things like import and export statements are
    // "unsupported", even though we're transpiling them first.
    "node/no-unsupported-features":  "off",

    "@typescript-eslint/adjacent-overload-signatures": "error",
    "@typescript-eslint/array-type": "error",
    "@typescript-eslint/ban-types": "error",
    "camelcase": "off",
    "@typescript-eslint/camelcase": "error",
    "@typescript-eslint/class-name-casing": "error",
    "indent": "off",
    "@typescript-eslint/indent": ["error", 2],
    "@typescript-eslint/member-delimiter-style": "error",
    "@typescript-eslint/no-angle-bracket-type-assertion": "error",
    "no-array-constructor": "off",
    "@typescript-eslint/no-array-constructor": "error",
    "@typescript-eslint/no-empty-interface": "error",
    "@typescript-eslint/no-inferrable-types": "error",
    "@typescript-eslint/no-misused-new": "error",
    "@typescript-eslint/no-namespace": "error",
    "@typescript-eslint/no-object-literal-type-assertion": "error",
    "@typescript-eslint/no-triple-slash-reference": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-var-requires": "error",
    "@typescript-eslint/prefer-interface": "error",
    "@typescript-eslint/prefer-namespace-keyword": "error",
    "@typescript-eslint/type-annotation-spacing": "error",
    "@typescript-eslint/no-require-imports": "error",
    "@typescript-eslint/no-for-in-array": "error"
  }
};

const test = {
  files: [
    'spec/**/*.js',
    'spec/**/*.ts'
  ],
  plugins: [
    'mocha',
  ],
  globals: {
    describe: false,
    it: false,
    beforeEach: false,
    afterEach: false,
    before: false,
    after: false,
    expect: false
  },
  rules: {
    'mocha/handle-done-callback': 'error',
    'mocha/no-exclusive-tests': 'error',
    'mocha/no-global-tests': 'error',
    'mocha/no-identical-title': 'error',
    'mocha/no-mocha-arrows': 'error',
    'mocha/no-nested-tests': 'error',
    'mocha/no-return-and-callback': 'error',
    'mocha/no-top-level-hooks': 'error',
  },
};

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  env: {
    'node': true,
    'browser': false,
    'es6': true
  },

  rules: Object.assign(
    {},
    require('eslint-plugin-node').configs.recommended.rules,
    require('eslint/conf/eslint-recommended').rules,
    {
      'no-constant-condition': ["error", { checkLoops: false }],
      'require-yield': 0,
      semi: ["error", "always"],
      'node/no-extraneous-require': ['error', {
        'allowModules': []
      }],
      'node/no-extraneous-import': ['error', {
        'allowModules': []
      }],
      'node/no-missing-require': ['error'],
      'no-undef': 'error',
  }),
  plugins: ['node', '@typescript-eslint'],
  overrides: [ test, ts ]
};

