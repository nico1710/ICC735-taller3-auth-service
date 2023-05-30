import { returnErrorResponse } from "./helpers/error.helper.js";
import { verifyToken } from "./helpers/jwt.helper.js";

function authMiddleware(req, res, next) {
	const headers = req.headers;

	const authorization = headers["Authorization"] ?? headers["authorization"];

	if (!authorization) {
		return res.status(401).send({ error: "need an authorization token!" });
	}

	const token = authorization.split(" ")[1];
	try {
		const payload = verifyToken(token);
		req.userId = payload.id;

		next();
	} catch (err) {
		return returnErrorResponse(err, res);
	}
}

export { authMiddleware };
