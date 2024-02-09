// jest.config.js
export default {
    preset: 'ts-jest/presets/default',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['./jest.setup.js'],
  };
  