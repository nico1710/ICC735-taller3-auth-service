import { returnErrorResponse } from "../helpers/error.helper.js";
import registerLogic from "../logic/register.logic.js";
import {
	registerValidation,
	passwordAndRutValidation,
} from "../validations/register.validation.js";

async function register(req, res) {
	const input = req.body;
	try {
		await registerValidation.validateAsync(input);

		const { email, password, rut, name } = input;

		await passwordAndRutValidation.validateAsync({ password, rut });

		const userId = await registerLogic({ email, password, rut, name });

		return res.status(200).json({ userId });
	} catch (error) {
		return returnErrorResponse(error, res);
	}
}

export default register;
