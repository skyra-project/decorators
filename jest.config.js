module.exports = {
	displayName: 'unit test',
	preset: 'ts-jest',
	testEnvironment: 'node',
	testRunner: 'jest-circus/runner',
	testMatch: ['<rootDir>/__tests__/**/*.test.ts'],
	setupFilesAfterEnv: ['<rootDir>/__tests__/jest.setup.ts'],
	moduleNameMapper: {
		'^@mocks/(.*)$': '<rootDir>/__mocks__/$1'
	},
	globals: {
		'ts-jest': {
			tsConfig: '<rootDir>/__tests__/tsconfig.json'
		}
	}
};
