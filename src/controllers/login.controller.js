import { returnErrorResponse } from "../helpers/error.helper.js";
import loginLogic from "../logic/login.logic.js";
import { loginValidation } from "../validations/login.validation.js";

async function login(req, res) {
	const input = req.body;
	try {
		await loginValidation.validateAsync(input);

		const { email, password } = input;

		const response = await loginLogic({ email, password });

		return res.status(200).json(response);
	} catch (error) {
		return returnErrorResponse(error, res);
	}
}

export default login;
