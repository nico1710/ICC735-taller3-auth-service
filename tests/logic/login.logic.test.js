import { expect, sinon } from "../chai.config.js";
import login from "../../src/logic/login.logic.js";
import UserModel from "../../src/models/user.model.js";
import { HTTPError } from "../../src/helpers/error.helper.js";
import loginMessages from "../../src/messages/login.messages.js";

describe("Logic: Logic login test", () => {

	let loginLogicStub;

	beforeEach(() => {
		loginLogicStub = sinon.stub(UserModel, 'findOne');
		loginLogicStub.returns({
			select() {
			 return this;
			 },
			 exec() {
			   return {
			 email: 'greci@gmail.com',
			 password: 'P@ssword123',
			 blocked: false,
			 comparePassword(password) {
			   return password === 'P@ssword123';
	 }}
   }});
    });

	afterEach(() => {
		loginLogicStub.restore();
	});

	it('[ERROR] User is Blocked', async () =>{	  
		  const  user = {
			email: 'grecia@gmail.com',
			password: 'P@ssword123',
		  };

		  const httpError = new HTTPError({
			name: loginMessages.blocked.name,
			msg: loginMessages.blocked.message,
			code: 403,
		});
	  
		  try {
			await login(user);
		  } catch (error) {
			expect(error).to.deep.equal(httpError);
		  }
    });

	it('[ERROR] User not found', async()=>{
		const user =  {
			email: "nico@gmail.com",
			password: "P@ssword123",
		};

		loginLogicStub.returns({
			select() {
			 return this;
			 },
			 exec() {
			   return {
			 email: 'greci@gmail.com',
			 password: 'P@ssword123',
			 blocked: false,
			 comparePassword(password) {
			   return password === 'P@ssword123';
	 }}
   }});

		const httpError = new HTTPError({
			name: loginMessages.invalidCredentials.name,
			msg: loginMessages.invalidCredentials.message,
			code: 403,
		});

		try {
			await login(user);
		  } catch (error) {
			expect(error).to.deep.equal(httpError);
		  }
    });

    it('[ERROR] User password not match', async()=>{
		const user =  {
			email: "nicolas@gmail.com",
			password: "P@ssword",
		};

		const httpError = new HTTPError({
			name: loginMessages.invalidCredentials.name,
			msg: loginMessages.invalidCredentials.message,
			code: 400,
		});

	    try {
			await login(user);
	    } catch (error) {
			expect(error).to.deep.equal(httpError);
  		}
    })
});