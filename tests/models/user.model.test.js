import { expect, sinon } from "../chai.config.js";
import UserModel from "../../src/models/user.model.js";
import { mongoConnect, mongoDisconnect } from "../../src/config/mongo";

describe("Models: User model unit test", () => {
	let userModelStub;

	before(async () => {
		await mongoConnect("mongodb://127.0.0.1:27017/auth-service-local");
	});

	after(async () => {
		await mongoDisconnect();
	});

	beforeEach(() => {
		userModelStub = sinon.stub(UserModel, "create");
	});

	afterEach(async () => {
		userModelStub.restore();
		await UserModel.deleteMany({});
	});

    it("[SUCCESS] Create user with stub", async () => {
		userModelStub.returns();
		const user = {name:"Nombre", email: "email@gmail.com", password: "esunapassword" };
		UserModel.save(user);
		expect(userModelStub).to.be.calledWith(user);
	});
});