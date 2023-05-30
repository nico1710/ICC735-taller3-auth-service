import jwt from "jsonwebtoken";
import environment from "../config/environment.js";

const {
	JWT: { SECRET, DEFAULT_EXPIRES },
} = environment;

/**
 * Generate JWT token with the data object
 * @param {object} args.data - Payload for encode the token
 * @param {string | Number} args.expiresIn - Expire token value. DEFAULT_EXPIRES by default
 * @returns {string} Generated token
 */
function generateToken({ data, expiresIn = DEFAULT_EXPIRES }) {
	return jwt.sign(data, SECRET, { expiresIn });
}

/**
 * Verify and decode token
 * @param {string} token - JWT
 * @returns {object} payload decoded
 * @throws {jwt.JsonWebTokenError} Error if the token has expired or Secret key doesn't work
 */
function verifyToken(token) {
	return jwt.verify(token, SECRET);
}

export { generateToken, verifyToken };
