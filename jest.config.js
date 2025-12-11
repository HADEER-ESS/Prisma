module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '\\.(ttf)$': '<rootDir>/__mocks__/file-mock.js',
    "^react-native-vision-camera$": "<rootDir>/__mocks__/react-native-vision-camera.js"
  },
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|react-native.*|@react-native.*|@?react-navigation.*|@shopify/react-native-skia)/)"
  ],
  // Other values
  testEnvironment: "@shopify/react-native-skia/jestEnv.js",
  setupFilesAfterEnv: [
    "@shopify/react-native-skia/jestSetup.js",
    './jest.setup.js'
  ],
};
