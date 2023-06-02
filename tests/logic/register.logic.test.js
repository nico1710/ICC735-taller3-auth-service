import { expect, sinon } from "../chai.config.js";
import register from "../../src/logic/register.logic.js";
import UserModel from "../../src/models/user.model.js";
import { HTTPError } from "../../src/helpers/error.helper.js";
import registerMessages from "../../src/messages/register.messages.js";
import axios from "axios";

describe("Logic: Register logic test", ()=>{
  // let axiosCreateStub;
  // let axiosInstance;
  let axiosGetStub;
  let registerLogicStub;
  let createUserStub;

	beforeEach(() => {
    axiosGetStub = sinon.stub(axios, "get");
    // axiosInstance = {
    //   get: axiosGetStub,
    // }
    // axiosCreateStub = sinon.stub(axios, 'create').returns(axiosInstance);
    
		registerLogicStub = sinon.stub(UserModel, "findOne");
    createUserStub = sinon.stub(UserModel.prototype, "save");
  });

	afterEach(() => {
		registerLogicStub.restore();
    axiosGetStub.restore();
    createUserStub.restore();
	});
     
  it("[ERROR] User has criminal records", async ()=>{
      const user = {
        name: "Nicolas",
        email: "test@gmail.com",
        rut: "19972287-5",
        password:"P@ssword123",
        verified: false,
        blocked: false
      };
      const mockedResponse = {
        status: 200,
        data: {
          rut: user.rut,
          fullName: "Nicolas Garcia",
          quantity: 2
        }
      };
      
      try {
        axiosGetStub.resolves(mockedResponse);

        await register(user);
      } catch (error) {
        expect(error.msg).to.equal("this user is not allowed to register in this platform");
        expect(error.name).to.equal("register_user_not_allowed_error");
        expect(axiosGetStub).to.have.been.called;
      }
  });

  it("[ERROR] User don't has criminal records but user is already registered", async () => {
      const user = {
        name: "Nicolas",
        email: "test@gmail.com",
        rut: "19972287-5",
        password:"P@ssword123",
        verified: false,
        blocked: false
      };
      const mockedResponse = {
        status: 200,
        data: {
          rut: user.rut,
          fullName: "Nicolas Garcia",
          quantity: 0
        }
      };
      
      try {
        axiosGetStub.resolves(mockedResponse);
        registerLogicStub.returns(
          { exec: sinon.stub().returns(user)  }
        );

        await register(user);
      } catch (error) {
        expect(error.name).to.equal("register_already_exists_error");
      }
  });

  it("[SUCCESS] Create user", async () => {
    const user = {
      name: "Nicolas",
      email: "test@gmail.com",
      rut: "19972287-5",
      password:"P@ssword123",
      verified: false,
      blocked: false
    };
    const mockedResponse = {
      status: 200,
      data: {
        rut: user.rut,
        fullName: "Nicolas Garcia",
        quantity: 0
      }
    };
    const savedUser = {
      _id: "user123",
      name: "Nicolas Pereira",
      email: "nicolas@gmail.com",
      password: "password123",
      verified: false,
      blocked: false,
      save: sinon.stub().resolves(),
    };
    
    axiosGetStub.resolves(mockedResponse);
    registerLogicStub.returns(
      { exec: sinon.stub().returns(null) }
    );
    createUserStub.resolves(savedUser);
    const savedUserId = await register(user);

    expect(savedUser._id).to.deep.equal(savedUserId);
  });
});