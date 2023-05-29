import { HTTPError } from "../helpers/error.helper.js";
import registerMessages from "../messages/register.messages.js";
import UserModel from "../models/user.model.js";
import randomize from "randomatic";
import { sendEmail } from "../services/notification.service.js";
import environment from "../config/environment.js";
import validateEmail from "../emails/validate.email.js";
import { generateToken } from "../helpers/jwt.helper.js";

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

async function register(user) {
	// Check if RUT is permitted

	await checkIfUserAlreadyExists(user);

	const valiationCode = randomize(
		randomizeConfig.pattern,
		randomizeConfig.length
	);

	const codeToken = generateToken({
		data: { code: valiationCode },
		expiresIn: "15m",
	});

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
