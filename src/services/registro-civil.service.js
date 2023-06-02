import axios from "axios";
import environment from "../config/environment.js";

const {
	REGISTRO_CIVIL_API: { BASE_URL, APIKEY },
} = environment;

const axiosInstance = axios.create({
	baseURL: BASE_URL,
	headers: {
		headers: {
			apikey: APIKEY,
		},
	},
});

/**
 * TODO: Send request to the real endpoint
 * Missing endpoint information (contract, documentation, etc) so:
 * Only returns false when the RUT is 55.555.555-5 (any format)
 * PLEASE CHANGE THIS FOR THE CORRECT IMPLEMENTATION OF THE API BEFORE MERGING INTO MASTER
 * @param {string} rut - User RUT
 */
async function getCriminalRecords(rut) {
  //return axiosInstance.get("????").then((response) => true);
	//const fakeResponse = rut !== "555555555";
	const response = await axios.get(`https://api.rut.cl/v1/person/${rut}/criminal_records`);
  if (response.status !== 200) return false;

  const { data } = response;
  if (data.quantity > 0) return false;
  return true;
}

export { getCriminalRecords };
