import {expect, sinon} from "./chai.config.js";
import {authMiddleware}  from "../src/middlewares.js";
import { verifyToken } from "../src/helpers/jwt.helper";
import { JsonWebTokenError } from "jsonwebtoken";

describe("Middleware Test", () => {
    const { any } = sinon.match;
    let next;
	const mockResponse = () => {
		const res = {};
		res.status = sinon.stub().returns(res);
		res.json = sinon.stub().returns(res);
        res.send = sinon.stub().returns(res);
		return res;
	};

  beforeEach(() => {
    next = sinon.stub();
  });

  it("[ERROR] Return 401 if authorization header is missing", () => {
    const req={headers:{}};
    const res = mockResponse();
    authMiddleware(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.send.calledWith({ error: "need an authorization token!" })).to.be.true;
  });

  it("[ERROR] Token verification fails", () => {
    const token = "tokeninvalido";
    const req = {headers:{
      authorization: "Bearer "+token,
    }};
    const res = mockResponse();
 
   const error={
    name: "JsonWebTokenError",
    msg: "invalid signature",
    statusCode: 403
   };

    const result = authMiddleware(req, res, next);
  
    
    console.log(result.json.toString());
    //ESte test necesita ser mejorado

  });
});
