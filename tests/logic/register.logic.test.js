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
        const user = {
            email: "test@gmail.com",
            rut: "19972287-5",
            password:"P@ssword123"
          };
    
        registerLogicStub.returns({exec(){
        return {email:user.email}}});

      const httpError = new HTTPError({
        name: registerMessages.alreadyExists.name,
        msg: registerMessages.alreadyExists.message,
        code: 400,
      });

      try {
        await register(user);
      } catch (error) {
        expect(error).to.deep.equal(httpError);
      }
      });

      it("[ERROR] Rut is not allowed", async ()=>{
        const user = {
            email: "test@gmail.com",
            rut: "12345678-9",
            password:"P@ssword123"
          };
    
        registerLogicStub.returns({exec(){
            return {
                email:"grecia@gmail.com",
                rut:"12311441-2"
            }}});

      const httpError = new HTTPError({
        name: registerMessages.userNotAllowed.name,
        msg: registerMessages.userNotAllowed.message,
        code: 400,
      });

      try {
        await register(user);
      } catch (error) {
        expect(error).to.deep.equal(httpError);
      }
           
      });

      it("[SUCCESS] Rut is allowed", async ()=>{
           
      });

      it("[SUCCESS] Register user in website", async ()=>{
           
      });
});