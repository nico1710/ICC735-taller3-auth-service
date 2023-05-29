class HTTPError extends Error {
	constructor({ name, msg, code }) {
		super();
		this.name = name;
		this.msg = msg;
		this.statusCode = code;
	}
}

function returnErrorResponse(error, res) {
	if (error instanceof HTTPError) {
		const { statusCode } = error;
		return res.status(statusCode).json({ error: { ...error } });
	}
	return res.status(500).json({ error: error.toString() });
}

const isBusinessError = (error) =>
	error.statusCode && String(error.statusCode).startsWith("4");

export { HTTPError, returnErrorResponse, isBusinessError };
