import verify from "../../src/controllers/verify.controller.js";
import { expect, sinon } from "../chai.config.js";
import * as VerifyLogic from "../../src/logic/verify.logic.js";
import verifyMessages from "../../src/messages/verify.messages.js";
import { HTTPError } from "../../src/helpers/error.helper.js";

describe("Controller: Verify", () => {
	const { any } = sinon.match;

	const mockResponse = () => {
		const res = {};
		res.status = sinon.stub().returns(res);
		res.json = sinon.stub().returns(res);
		return res;
	};

	let verifyLogicStub;

	beforeEach(() => {
		verifyLogicStub = sinon.stub(VerifyLogic, "default");
	});

	afterEach(() => {
		verifyLogicStub.restore();
	});
});
