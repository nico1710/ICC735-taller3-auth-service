import Joi from "joi";
import { stringRequired } from "./common.validations.js";
import { HTTPError } from "../helpers/error.helper.js";
import verifyMessages from "../messages/verify.messages.js";

const validationErrorName = verifyMessages.validation.name;

const verifyValidation = Joi.object()
	.required()
	.keys({
		code: stringRequired(
			new HTTPError({
				name: validationErrorName,
				msg: verifyMessages.validation.messages.code,
				code: 400,
			})
		),
	});

export { verifyValidation };
