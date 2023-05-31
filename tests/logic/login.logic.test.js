import { expect, sinon } from "../chai.config.js";
import * as login from "../../src/logic/login.logic.js";
import UserModel from "../../src/models/user.model.js";
import { HTTPError } from "../../src/helpers/error.helper.js";
import loginMessages from "../../src/messages/login.messages.js";

describe("Logic: Logic login test", () => {

    const { any } = sinon.match;

	const mockResponse = () => {
		const res = {};
		res.status = sinon.stub().returns(res);
		res.json = sinon.stub().returns(res);
		return res;
	};

	let loginLogicStub;

	beforeEach(() => {
		loginLogicStub = sinon.stub(login, "default");
	});

	afterEach(() => {
		loginLogicStub.restore();
	});


    it('User is Blocked', async () =>{
        const req = {
			body: {
				email: "email",
				password: "password",
				blocked: true,
			},
		};

		const httpError = new HTTPError({
			name: loginMessages.blocked,
			msg: loginMessages.blocked.message,
			code: 400,
		});

		const res = mockResponse();

    });

    it('User not found', async()=>{

    })

    it('User password not match', async()=>{

    })
});