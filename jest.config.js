module.exports = {
	displayName: 'unit test',
	preset: 'ts-jest',
	testEnvironment: 'node',
	testRunner: 'jest-circus/runner',
	testMatch: ['<rootDir>/tests/**/*.test.ts'],
	setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
	moduleNameMapper: {
		'^@mocks/(.*)$': '<rootDir>/tests/mocks/$1',
		'^@src/(.*)$': '<rootDir>/src/$1'
	},
	globals: {
		'ts-jest': {
			tsConfig: '<rootDir>/tests/tsconfig.json'
		}
	}
};
