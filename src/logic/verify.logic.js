import UserModel from "../models/user.model.js";
import { HTTPError } from "../helpers/error.helper.js";
import verifyMessages from "../messages/verify.messages.js";
import { verifyToken } from "../helpers/jwt.helper.js";

/**
 * Extact the verify code from token
 * @param {string} args.code - JWT code
 * @throws {HTTPError} throws 400 HTTPError when an error throw by verifyToken
 */
function extractCode({ code }) {
	try {
		const { code: decodedCode } = verifyToken(code);

		return decodedCode;
	} catch (error) {
		throw new HTTPError({
			name: verifyMessages.codeExpired.name,
			msg: verifyMessages.codeExpired.message,
			code: 400,
		});
	}
}

/**
 * Check if the user is already verified
 * @param {boolean} args.verified - User verified flag
 * @throws {HTTPError} throws 400 HTTPError when the user already verified
 */
function checkIfUserIsAlreadyVerified({ verified }) {
	if (verified) {
		const { alreadyVerified } = verifyMessages;

		throw new HTTPError({
			name: alreadyVerified.name,
			msg: alreadyVerified.message,
			code: 400,
		});
	}
}

/**
 * Check if code string from user document exists
 * @param {boolean} args.code - User document code
 * @throws {HTTPError} throws 404 HTTPError when the code is null or empty
 */
function checkIfCodeExists({ code }) {
	if (!code) {
		const { codeNotFound } = verifyMessages;

		throw new HTTPError({
			name: codeNotFound.name,
			msg: codeNotFound.message,
			code: 404,
		});
	}
}

/**
 * Verify the user by id and input code
 * @param {string} args.userId - User id to verify
 * @param {string} args.code - Input code to compare
 * @returns {boolean} true if the verify process complete successfully
 * @throws {HTTPError} throws 404 HTTPError when the user not found by the userId
 * @throws {HTTPError} throws 400 HTTPError when the user code not match with the input code
 */
async function verify({ userId, code }) {
	const foundUser = await UserModel.findById(userId).select("+code");

	if (!foundUser) {
		throw new HTTPError({
			name: verifyMessages.userNotFound.name,
			msg: verifyMessages.userNotFound.message,
			code: 404,
		});
	}

	checkIfUserIsAlreadyVerified(foundUser);
	checkIfCodeExists(foundUser);

	const decodedCode = extractCode(foundUser);

	if (decodedCode != code) {
		throw new HTTPError({
			name: verifyMessages.invalidCode.name,
			msg: verifyMessages.invalidCode.message,
			code: 400,
		});
	}

	await foundUser.setVerified();

	return true;
}

export default verify;
