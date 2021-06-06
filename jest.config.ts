module.exports = {
    collectCovereFrom: ['<rootDir>/src/**/*.ts'],
    preset: '@shelf/jest-mongodb',
    coverageDirectory: 'coverage',
    testEnvironment: 'node',
    transform: {
        '.+\\.ts$': 'ts-jest'
    }
}
