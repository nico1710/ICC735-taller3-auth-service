import { HTTPError } from "../helpers/error.helper.js";
import registerMessages from "../messages/register.messages.js";
import UserModel from "../models/user.model.js";
import randomize from "randomatic";
import { sendEmail } from "../services/notification.service.js";
import environment from "../config/environment.js";
import validateEmail from "../emails/validate.email.js";
import { generateToken } from "../helpers/jwt.helper.js";
import { getCriminalRecords } from "../services/registro-civil.service.js";

const {
	EMAIL_SERVICE: {
		SUBJECTS: { VALIDATE },
	},
	NODE_ENV,
	ENVS: { local },
} = environment;

const randomizeConfig = {
	pattern: "Aa0",
	length: 6,
};

/**
 * Check if one user already exists in the database by email or rut
 * @param {string} args.email - User's email
 * @param {string} args.rut - User's rut
 * @throws {HTTPError} throws 400 HTTPError when an user already exists
 */
async function checkIfUserAlreadyExists({ email, rut }) {
	const emailRegex = new RegExp(`^${email}$`, "i");
	const rutRegex = new RegExp(`^${rut}$`, "i");

	const { alreadyExists } = registerMessages;
	const { messages } = alreadyExists;

	const foundUser = await UserModel.findOne({
		$or: [
			{
				email: emailRegex,
			},
			{
				rut: rutRegex,
			},
		],
	}).exec();

	if (foundUser) {
		const message = emailRegex.exec(foundUser.email)
			? messages.email
			: messages.rut;

		throw new HTTPError({
			name: alreadyExists.name,
			msg: message,
			code: 400,
		});
	}
}

/**
 * Generate verify code token with 15 minutes of lifetime
 * @returns {string} JWT
 */
function generateCodeToken() {
	const valiationCode = randomize(
		randomizeConfig.pattern,
		randomizeConfig.length
	);

	const codeToken = generateToken({
		data: { code: valiationCode },
		expiresIn: "15m",
	});

	return codeToken;
}

/**
 * TODO: Get correct (real) endpoint response from 'getCriminalRecords'
 * and process the returned data into boolean variable
 * @param {string} rut - User RUT
 * @returns {boolean} true if the user doesn't has criminal records
 */
async function checkIfRUTisAllowed(rut) {
	const response = await getCriminalRecords(rut);
	if (!response) {
		const { userNotAllowed } = registerMessages;

		throw new HTTPError({
			name: userNotAllowed.name,
			msg: userNotAllowed.message,
			code: 403,
		});
	}
	return response;
}

/**
 * Create a new user and save in database
 * @param {User} user - User arguments
 * @returns {string} id of the created user
 */
async function register(user) {
	const { rut } = user;

	await checkIfRUTisAllowed(rut);
	await checkIfUserAlreadyExists(user);

	const codeToken = generateCodeToken();

	const userInstance = new UserModel({ ...user, code: codeToken });

	const savedUser = await userInstance.save();

	// Validate Email if NODE_ENV is different of 'local'
	if (NODE_ENV !== local) {
		await sendEmail({
			to: savedUser.email,
			subject: VALIDATE,
			body: validateEmail(user),
		}).catch(async (err) => {
			await savedUser.remove();
			throw err;
		});
	}

	return savedUser._id;
}

export default register;
