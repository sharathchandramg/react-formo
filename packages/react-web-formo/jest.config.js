const { defaults } = require('jest-config');
module.exports = {
  roots: ['./src'],

  transformIgnorePatterns: ['./node_modules/'],
  testRegex: '/src/Test/.*.test.(js|ts|tsx)?$',
  moduleFileExtensions: [
    ...defaults.moduleFileExtensions,
    'web.js',
    'js',
    'web.ts',
    'ts',
    'web.tsx',
    'tsx',
    'json',
    'web.jsx',
    'jsx',
    'node',
  ],
  setupFiles: ['./setupTests.js'],
};
