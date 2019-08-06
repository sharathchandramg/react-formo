const {defaults} = require('jest-config');
module.exports = {
  "roots": [
    "./"
  ],

  "transformIgnorePatterns": [
    "./node_modules/"
  ],
  "testRegex": "/__tests__/.*.spec.(js|ts|tsx)?$",
  "moduleFileExtensions":[...defaults.moduleFileExtensions,'web.js', 'js', 'web.ts', 'ts', 'web.tsx', 'tsx', 'json', 'web.jsx', 'jsx', 'node'],
  "snapshotSerializers": ["enzyme-to-json/serializer"],
}