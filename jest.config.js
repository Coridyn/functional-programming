module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    "moduleFileExtensions": [
      "js",
      "ts",
    ],
    transform: {
        // CFH: only transform js files
        '^.+\\.jsx?$': 'babel-jest',
        
        '^.+\\.tsx?$': 'ts-jest',
    },
    'transformIgnorePatterns': [
        // Don't transform node_modules packages (but we allow bower dependencies to be transformed)
        '<rootDir>/node_modules/'
    ],
    // 'moduleNameMapper': {
    //     '^jquery$': '<rootDir>/build/vendor/assets/lib-proxy/dist/jquery.js',
    // },
    'moduleDirectories': [
        'node_modules',
    ],
    "testPathIgnorePatterns": [
        "/node_modules/",
    ],
    "testMatch": [
        // "<rootDir>/dist/test/library.umd.(js|jsx|ts|tsx)"
        // "<rootDir>/test/jest/*.spec.(js|jsx|ts|tsx)"
        "<rootDir>/src/**/*.ts"
    ],
    'globals': {
        'ts-jest': {
            tsconfig: '<rootDir>/tsconfig.json'
        }
    }
};

/*
"jest": {
    "moduleFileExtensions": [
      "js",
      "ts"
    ],
    "testURL": "http://localhost/",
    "transform": {
      "^.+\\.tsx?$": "ts-jest"
    }
  }
*/
