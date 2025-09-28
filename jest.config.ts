import { Config } from 'jest';

const config: Config = {
  silent: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['**/src/**/*.ts', '!**/src/**/*.type.ts'],
  coverageReporters: ['html', 'lcov', 'text'],
  coverageDirectory: './coverage',
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
  testMatch: ['**/src/**/?(*.)+(spec).(ts)'],
  clearMocks: true,
  roots: ['<rootDir>/src/'],
  setupFiles: ['<rootDir>/.jest/setEnvVars.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@helpers/(.*)$': '<rootDir>/src/helpers/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@models/(.*)$': '<rootDir>/src/models/$1',
  },
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 20,
      lines: 20,
      statements: 20,
    },
  },
};
//export default config

module.exports = config;
