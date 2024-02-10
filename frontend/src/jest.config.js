// jest.config.js
export default {
    preset: 'ts-jest/presets/default',
    "transform": {
      "^.+\\.(ts|tsx|js|jsx)$": "ts-jest"
    },
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['./jest.setup.js'],
  };
  