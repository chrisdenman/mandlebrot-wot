// noinspection JSUnusedGlobalSymbols
export default {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "/node_modules/"
  ],
  coverageProvider: "v8",
  errorOnDeprecated: true,
  moduleFileExtensions: ["js", "wat"],
  maxWorkers: "100%",
  slowTestThreshold: 1,
  transform: {}
};
