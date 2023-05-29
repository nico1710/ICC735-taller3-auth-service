import environment from "./environment.js";

const { HOST, PORT } = environment;

const SWAGGER_OPTIONS = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Talle 3: Auth service",
			version: "0.1.0",
			description: "Auth service",
			contact: {
				name: "Jorge Silva",
				email: "jorgeandres.silva@ufrontera.cl",
			},
		},
		servers: [
			{
				url: HOST,
				port: PORT,
			},
		],
	},
	apis: ["./src/swagger/*.swagger.yml"],
};

export default SWAGGER_OPTIONS;
