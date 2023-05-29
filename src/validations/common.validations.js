import Joi from "joi";

const emailRequired = (error) => Joi.string().email().required().error(error);

const stringRequired = (error) => Joi.string().required().error(error);

export { emailRequired, stringRequired };
