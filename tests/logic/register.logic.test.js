import { expect, sinon } from "../chai.config.js";
import register from "../../src/logic/register.logic.js";
import UserModel from "../../src/models/user.model.js";
import { HTTPError } from "../../src/helpers/error.helper.js";
import registerMessages from "../../src/messages/register.messages.js";

describe("Logic: Register logic test", ()=>{
      
    let registerLogicStub;

	beforeEach(() => {
		registerLogicStub = sinon.stub(UserModel, 'findOne');
    });

	afterEach(() => {
		registerLogicStub.restore();
	});
     

      it("[ERROR] User is alredy register in website", async ()=>{
           const user ={
              name: "Nicolas",
              rut: "19972287-5",
              email: "nicolas@gmail.com",
              password: "P@ssword123"
           };
        registerLogicStub.resolves({});

        const httpError ={
            name: registerMessages.alreadyExists.name,
            msg: registerMessages.alreadyExists.messages,
            code: 400
        }

        try {
			await register(user);
		} catch (error) {
			expect(error).to.equal(httpError);
		}
      });

      it("[ERROR] Rut is allowed", async ()=>{
           
      });

      it("[SUCCESS] Register user in website", async ()=>{
           
      });
});