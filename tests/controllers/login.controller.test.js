import login from "../../src/controllers/login.controller.js";
import { expect, jest } from "@jest/globals";
import * as LoginLogic from "../../src/logic/login.logic.js";
import { HTTPError } from "../../src/helpers/error.helper.js";
import loginMessages from "../../src/messages/login.messages.js";

describe("Controller: Login", () => {
	const loginLogicStub = jest.spyOn(LoginLogic, "default");

	const defaultReq = {
		body: {
			email: "email@host.com",
			password: "password",
		},
	};

	const res = {
		status: jest.fn().mockReturnThis(),
		json: jest.fn(),
	};

	it("[ERROR] Should throw an error when the email doesn't exists in the body", async () => {
		const req = {
			body: {
				password: "password",
			},
		};

		const httpError = new HTTPError({
			name: loginMessages.validation.name,
			msg: loginMessages.validation.messages.email,
			code: 400,
		});

		await login(req, res);
		expect(res.status).toBeCalledWith(400);
		expect(res.json).toBeCalledWith({ error: { ...httpError } });
		expect(loginLogicStub).not.toBeCalled();
	});

	it("[ERROR] Should throw an error when the password doesn't exists in the body", async () => {
		const req = {
			body: {
				email: "email@some.com",
			},
		};

		const httpError = new HTTPError({
			name: loginMessages.validation.name,
			msg: loginMessages.validation.messages.password,
			code: 400,
		});

		await login(req, res);
		expect(res.status).toBeCalledWith(400);
		expect(res.json).toBeCalledWith({ error: { ...httpError } });
		expect(loginLogicStub).not.toBeCalled();
	});

	it("[ERROR] Should throw an error when the email format is invalid", async () => {
		const httpError = new HTTPError({
			name: loginMessages.validation.name,
			msg: loginMessages.validation.messages.email,
			code: 400,
		});

		const req = {
			body: {
				email: "email",
				password: "password",
			},
		};

		await login(req, res);
		expect(res.status).toBeCalledWith(400);
		expect(res.json).toBeCalledWith({ error: { ...httpError } });
		expect(loginLogicStub).not.toBeCalled();
	});

	it("[ERROR] Should throw an 500 error when LoginLogic throws an TypeError", async () => {
		const error = new TypeError("some-error");

		loginLogicStub.mockRejectedValue(error);

		await login(defaultReq, res);

		expect(res.status).toBeCalledWith(500);
		expect(res.json).toBeCalledWith({ error: error.toString() });
		expect(loginLogicStub).toBeCalled();
	});

	it("[ERROR] Should throw an 400 error when LoginLogic throws an HTTPError with 400 code", async () => {
		const error = new HTTPError({
			name: loginMessages.validation.name,
			msg: loginMessages.validation.messages.email,
			code: 400,
		});

		loginLogicStub.mockRejectedValue(error);

		await login(defaultReq, res);

		expect(res.status).toBeCalledWith(400);
		expect(res.json).toBeCalledWith({ error: { ...error } });
		expect(loginLogicStub).toBeCalled();
	});

	it("[SUCCESS] Should return a token when LoginLogic return the token", async () => {
		const token = "this-is-a-token";
		const verified = true;

		loginLogicStub.mockResolvedValue({ token, verified });

		await login(defaultReq, res);
		expect(res.json).toBeCalledWith({ token, verified });
		expect(res.status).toBeCalledWith(200);
		expect(loginLogicStub).toBeCalledWith({
			email: defaultReq.body.email,
			password: defaultReq.body.password,
		});
	});
});
