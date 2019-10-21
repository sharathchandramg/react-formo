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
  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupFiles: ['./setupTests.js'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};
