import { expect, sinon } from "../chai.config.js";
import {checkIfUserAlreadyExists,generateCodeToken,checkIfRUTisAllowed,register} from "../../src/logic/register.logic.js";
import UserModel from "../../src/models/user.model.js";
import { HTTPError } from "../../src/helpers/error.helper.js";
import registerMessages from "../../src/messages/register.messages.js";

describe("Logic: Register logic test", ()=>{

      it("[ERROR] User is alredy register in website", async ()=>{
           
      });

      it("[ERROR] Rut is allowed", async ()=>{
           
      });

      it("[SUCCESS] Register user in website", async ()=>{
           
      });
});