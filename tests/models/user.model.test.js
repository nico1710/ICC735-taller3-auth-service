import { expect, jest } from "@jest/globals";
import UserModel from "../../src/models/user.model.js";
import {connectDB} from "../../src/config/mongo";

jest.mock("bcrypt");
describe("Models: User model unit test", () => {
	const userModelStub = jest.spyOn(UserModel, "create");

	beforeAll(async () => {
	   await connectDB();
	});

	beforeEach(async () => {
		await userModelStub.deleteMany({});
	});

    it("[SUCCESS] Create user with stub", async () => {
        
	});

    it("[SUCCESS] Compare password of user", async () => {
        
	});

    it("[SUCCESS] Change user to verified", async () => {
        
	});
});