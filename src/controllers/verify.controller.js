import { returnErrorResponse } from "../helpers/error.helper.js";
import verifyLogic from "../logic/verify.logic.js";
import { verifyValidation } from "../validations/verify.validation.js";

async function verify(req, res) {
	const input = req.body;
	try {
		await verifyValidation.validateAsync(input);

		const { code } = input;

		const response = await verifyLogic({ userId: req.userId, code });

		return res.status(200).json({ response });
	} catch (error) {
		return returnErrorResponse(error, res);
	}
}

export default verify;
