import Joi from "joi";
import { emailRequired, stringRequired } from "./common.validations.js";
import { HTTPError } from "../helpers/error.helper.js";
import loginMessages from "../messages/login.messages.js";

const validationErrorName = loginMessages.validation.name;

const loginValidation = Joi.object()
	.required()
	.keys({
		email: emailRequired(
			new HTTPError({
				name: validationErrorName,
				msg: loginMessages.validation.messages.email,
				code: 400,
			})
		),
		password: stringRequired(
			new HTTPError({
				name: validationErrorName,
				msg: loginMessages.validation.messages.password,
				code: 400,
			})
		),
	});

export { loginValidation };
