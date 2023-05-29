import UserModel from "../models/user.model.js";
import { HTTPError } from "../helpers/error.helper.js";
import loginMessages from "../messages/login.messages.js";
import { generateToken } from "../helpers/jwt.helper.js";

function checkIfUserValidated({ verified }) {
	if (!verified) {
		const { noVerified } = loginMessages;

		throw new HTTPError({
			name: noVerified.name,
			msg: noVerified.message,
			code: 403,
		});
	}
}

function checkIfUserBlocked({ blocked }) {
	if (blocked) {
		const { blocked } = loginMessages;

		throw new HTTPError({
			name: blocked.name,
			msg: blocked.message,
			code: 403,
		});
	}
}

async function login({ email, password }) {
	const foundUser = await UserModel.findOne({
		email: new RegExp(`^${email}$`, "i"),
	})
		.select("+password")
		.exec();

	const { invalidCredentials } = loginMessages;

	if (!foundUser) {
		throw new HTTPError({
			name: invalidCredentials.name,
			msg: invalidCredentials.message,
			code: 400,
		});
	}

	const passwordMatch = await foundUser.comparePassword(password);

	if (!passwordMatch) {
		throw new HTTPError({
			name: invalidCredentials.name,
			msg: invalidCredentials.message,
			code: 400,
		});
	}

	checkIfUserValidated(foundUser);
	checkIfUserBlocked(foundUser);

	return generateToken({ data: { id: foundUser._id } });
}

export default login;
