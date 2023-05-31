import { expect, sinon } from "../chai.config.js";
import UserModel from "../../src/models/user.model.js";
import verify from "../../src/logic/verify.logic.js";

describe("Verify Logic: Verify user unit test", () => {
  let saveLogStub;

  beforeEach(() => {
    saveLogStub = sinon.stub(UserModel, "findById");
  });

  afterEach(() => {
    saveLogStub.restore();
  });

  it("[SUCCESS] Should return true when the code is a valid string", async () => {
    const input = {
      userId: "user123",
      code: "code",
    };

    try {
      saveLogStub.withArgs(input.userId).returns({ select: () => {} });

      await verify(input);
    }catch(error) {
      expect(error.msg).to.equal("user not found");
      expect(error.name).to.equal("verify_user_not_found_error");
      expect(saveLogStub).to.have.been.called;
    }
  });
});
