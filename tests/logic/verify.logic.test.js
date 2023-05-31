import { expect, sinon } from "../chai.config.js";
import UserModel from "../../src/models/user.model.js";
import verify from "../../src/logic/verify.logic.js";

describe("Verify Logic: Verify user unit test", () => {
  let findUserStub;

  beforeEach(() => {
    findUserStub = sinon.stub(UserModel, "findById");
  });

  afterEach(() => {
    findUserStub.restore();
  });

  it("[ERROR] Should return a error when the userId is a invalid", async () => {
    const input = {
      userId: "user123",
      code: "code",
    };

    try {
      findUserStub.withArgs(input.userId).returns({ select: () => {} });

      await verify(input);
    }catch(error) {
      expect(error.msg).to.equal("user not found");
      expect(error.name).to.equal("verify_user_not_found_error");
      expect(findUserStub).to.have.been.called;
    }
  });

  it("[ERROR] Should return a error when the user is verified", async () => {
    const input = {
      userId: "user123",
      code: "code",
    };

    const foundUser = {
      _id: input.userId,
      code: input.code,
      verified: true,
    };

    try {
      findUserStub.withArgs(input.userId).returns({ select: sinon.stub().returns(foundUser) });

      await verify(input);
    }catch(error) {
      expect(error.msg).to.equal("the user is already verified");
      expect(error.name).to.equal("verify_already_verified_error");
      expect(findUserStub).to.have.been.called;
    }
  });

  it("[ERROR] Should return a error when the user is not verified and code is undefined", async () => {
    const input = {
      userId: "user123",
      code: null
    };

    const foundUser = {
      _id: input.userId,
      code: null,
      verified: false,
    };

    try {
      findUserStub.withArgs(input.userId).returns({ select: sinon.stub().returns(foundUser) });

      await verify(input);
    }catch(error) {
      expect(error.msg).to.equal("code not found. Please contact support");
      expect(error.name).to.equal("verify_code_not_found_error");
      expect(findUserStub).to.have.been.called;
    }
  });

  it("[ERROR] Should return a error when the user is not verified and code is correct but is expired", async () => {
    const input = {
      userId: "user123",
      code: "code"
    };

    const foundUser = {
      _id: input.userId,
      code: input.code,
      verified: false,
    };

    try {
      findUserStub.withArgs(input.userId).returns({ select: sinon.stub().returns(foundUser) });

      await verify(input);
    }catch(error) {
      expect(error.msg).to.equal("the code has expired");
      expect(error.name).to.equal("verify_code_expired_error");
      expect(findUserStub).to.have.been.called;
    }
  });
});
