import { expect, sinon } from "../chai.config.js";
import { expect as jestExpect, jest } from "@jest/globals";
import * as VerifyLogic from "../../src/logic/verify.logic.js";
import verifyMessages from "../../src/messages/verify.messages.js";
import verify from "../../src/controllers/verify.controller.js";
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

  it("[ERROR] Should throw an error when the code doesn't exists in the body", async () => {
    const req = {
      body: {},
    };

    const httpError = new HTTPError({
      name: verifyMessages.validation.name,
      msg: verifyMessages.validation.messages.code,
      code: 400,
    });

    const res = mockResponse();

    await verify(req, res);
    expect(res.status).to.be.calledWith(400);
    expect(res.json).to.be.calledWith({ error: { ...httpError } });
    expect(verifyLogicStub).to.not.be.called;
  });

  it("[ERROR] Should throw an error when the code is not a string", async () => {
    const req = {
      body: {
        code: 235,
      },
    };

    const httpError = new HTTPError({
      name: verifyMessages.validation.name,
      msg: verifyMessages.validation.messages.code,
      code: 400,
    });

    const res = mockResponse();

    await verify(req, res);

    expect(res.status).to.be.calledWith(400);
    expect(res.json).to.be.calledWith({ error: { ...httpError } });
    expect(verifyLogicStub).to.not.be.called;
  });

  it("[ERROR] Should throw an 500 error when VerifyLogic throws an TypeError", async () => {
    const error = new TypeError("some-error");
    const req = {
      body: {
        code: "code",
      },
      userId: null,
    };

    const res = mockResponse();

    verifyLogicStub.rejects(error);

    await verify(req, res);
    expect(res.status).to.be.calledWith(500);
    expect(res.json).to.be.calledWith({ error: error.toString() });
    expect(verifyLogicStub).to.be.called;
  });

  it("[ERROR] Should throw an 400 error when VerifyLogic throws an HTTPError with 400 code", async () => {
    const req = {
      body: {
        code: "code",
      },
      userId: null,
    };

    const error = new HTTPError({
      name: verifyMessages.userNotFound.name,
      msg: verifyMessages.userNotFound.message,
      code: 400,
    });

    verifyLogicStub.rejects(error);
    const res = mockResponse();

    await verify(req, res);

    expect(res.status).to.be.calledWith(400);
    expect(res.json).to.be.calledWith({ error: { ...error } });
    expect(verifyLogicStub).to.be.called;
  });
});
