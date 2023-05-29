import Joi from "joi";
import { emailRequired, stringRequired } from "./common.validations.js";
import { HTTPError } from "../helpers/error.helper.js";
import registerMessages from "../messages/register.messages.js";
import { validate as validateRut } from "rut.js";

const validationErrorName = registerMessages.validation.name;

const httpErrorInstance = (msg) =>
	new HTTPError({
		name: validationErrorName,
		msg,
		code: 400,
	});

const registerValidation = Joi.object()
	.required()
	.keys({
		email: emailRequired(
			httpErrorInstance(registerMessages.validation.messages.email)
		),
		password: stringRequired(
			httpErrorInstance(registerMessages.validation.messages.password)
		),
		rut: stringRequired(
			httpErrorInstance(registerMessages.validation.messages.rut)
		),
		name: stringRequired(
			httpErrorInstance(registerMessages.validation.messages.name)
		),
	});

const strongPasswordExpression =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;

const passwordAndRutValidation = Joi.object()
	.required()
	.keys({
		password: Joi.string()
			.min(8)
			.regex(new RegExp(strongPasswordExpression))
			.required()
			.error(
				httpErrorInstance(registerMessages.validation.messages.weakPassword)
			),
		rut: Joi.string()
			.min(8)
			.custom((value, helper) => !validateRut(value) && helper.error())
			.error(
				httpErrorInstance(registerMessages.validation.messages.invalidRut)
			),
	});

export { registerValidation, passwordAndRutValidation };
