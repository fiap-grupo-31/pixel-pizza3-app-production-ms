module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: [
        "/src/interfaces/controllers/productionRabbitmq.ts",
        "/src/interfaces/controllers/productionRabbitmq.test.ts",
    ],
};