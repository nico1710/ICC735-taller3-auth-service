import jwt from "jsonwebtoken";
import environment from "../config/environment.js";

const {
	JWT: { SECRET, DEFAULT_EXPIRES },
} = environment;

function generateToken({ data, expiresIn = DEFAULT_EXPIRES }) {
	return jwt.sign(data, SECRET, { expiresIn });
}

export { generateToken };
