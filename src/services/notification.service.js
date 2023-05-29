import axios from "axios";
import environment from "../config/environment.js";

const {
	EMAIL_SERVICE: { BASE_URL, ENDPOINTS },
} = environment;

const axiosInstance = axios.create({ baseURL: BASE_URL });

function sendEmail({ to, subject, body }) {
	return axiosInstance
		.post(ENDPOINTS.SEND_EMAIL, {
			to,
			subject,
			body,
		})
		.then(() => true);
}

export { sendEmail };
