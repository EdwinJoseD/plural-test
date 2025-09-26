import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	silent: true,
	preset: 'ts-jest',
	testEnvironment: 'node',
	collectCoverage: true,
	collectCoverageFrom: [
		'**/src/**/*.ts',
		'!**/src/**/*.type.ts',
		"!**/src/**/axios.ts",
	],
	coverageReporters: ['html', 'lcov', 'text'],
	coverageDirectory: './coverage',
	testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
	testMatch: ['**/src/**/?(*.)+(spec).(ts)'],
	clearMocks: true,
	roots: ['<rootDir>/src/'],
	setupFiles: ['<rootDir>/.jest/setEnvVars.ts'],
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 80,
			lines: 80,
			statements: 80,
		},
	},
};
//export default config

module.exports = config;
