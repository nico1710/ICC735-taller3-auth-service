import { expect, sinon } from "../chai.config.js";
import { generateToken,verifyToken} from "../../src/helpers/jwt.helper.js";
import jwt from 'jsonwebtoken';

describe("Helpers: Jwt helper test", () => {
  
	let jwtStub;

	beforeEach(() => {
		jwtStub = sinon.stub(jwt, 'sign').returns('generatedToken');
    });

	afterEach(() => {
		jwtStub.restore();
	});

    it('[SUCCESS] Generate JWT token', () => {
        const data = { userId: '12345' };
        const expire = '1h';
    
        const token = generateToken({ data, expire });
    
        expect(token).to.equal('generatedToken');
      });

      it('[SUCCESS] Verify JWT token', () => {
        const token = 'Esuntoken';
        const decodedData = { userId: '12ab' };
        const jwtStub = sinon.stub(jwt, 'verify').returns(decodedData);  
        const verify = verifyToken(token);
    
        expect(verify).to.deep.equal(decodedData);
      });
    
});