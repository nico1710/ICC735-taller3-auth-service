module.exports = {
	transform: {
		"^.+\\.(js|jsx)$": "babel-jest",
	},
	collectCoverageFrom: ["./src/**/*.js"],
	coveragePathIgnorePatterns: [
		"./src/routes.js",
		"./src/app.js",
		"./src/mocks/",
		"./src/config/",
		"./src/swagger/",
	],
	coverageThreshold: {
		global: {
			lines: 80,
		},
	},
};
