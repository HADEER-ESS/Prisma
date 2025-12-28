module.exports = {
  preset: 'react-native', //used for testing React Native projects
  moduleNameMapper: {// how to find the files that you import in your code.
    '\\.(ttf)$': '<rootDir>/__mocks__/file-mock.js',
    "^react-native-vision-camera$": "<rootDir>/__mocks__/react-native-vision-camera.js",
    // "^components/ (.*)$": "<rootDir>/src/components/$1" // when use shortcuts or aliases to import files
  },
  transformIgnorePatterns: [ // tell Jest which files it should not change before testing them
    //! => sign to exclude the ones
    //This means that Jest will change any file in the node_modules folder except for the ones that match the specified patterns
    "node_modules/(?!(react-native|react-native.*|@react-native.*|@?react-navigation.*|@shopify/react-native-skia)/)"
  ],
  // Other values
  testEnvironment: "node", //"@shopify/react-native-skia/jestEnv.js", //specify the test environment that will be used for testing
  setupFiles: [//executed before any tests run
    './__mocks__/file-mock.js'
  ],
  moduleFileExtensions: [//specify the file extensions that should be looked for when running tests
    "ts",
    "tsx",
    "js",
  ],
  setupFilesAfterEnv: [ //set up additional testing libraries
    "@shopify/react-native-skia/jestSetup.js",
    './jest.setup.js'
  ],
  transform: { //specify how to transform files before testing them
    "^.+\\.(js|ts|tsx)$": "babel-jest", //use babel-jest to transform any file with js,ts,jsx,tsx extension
    "\\.ts$": "ts-jest" //use ts-jest to transform any file with ts extension
  },
  // testMatch: [ //specify which files should be considered as test files by Jest.
  //   "<rootDir>/__tests__/*.js", // * =>means any file name
  //   "<rootDir>/src/**/*.(test|spec).js" //** => means any subdirectories,  
  // ],
  coverageThreshold: { //specify the minimum percentage of code coverage that your tests must achieve
    global: {
      statements: 80,  //single command in your code, such as a variable declaration
      branches: 70,  //possible path of execution in your code as if||else Blocks or case in switch-cases
      functions: 90,  //block of code that performs a specific task, called by another part of ypur code
      lines: 85       //a single line of code in your source file
    }
  },
  watchPlugins: [  //a way to customize how Jest runs your tests in watch mode.
    //To use the watchPlugins option, you need to install a plugin that provides some extra functionality for your tests. 
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname"
  ]
};

{/*
  Jest will not actually change the original files in the “node_modules” directory.
   It will only change them temporarily in memory when it runs the tests.
  */}
