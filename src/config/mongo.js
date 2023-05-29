import mongoose from "mongoose";
import environment from "./environment.js";

const { MONGO_URI } = environment;

export async function connectDB() {
	mongoose.set("strictQuery", true);
	return mongoose
		.connect(MONGO_URI)
		.then(() => console.log("Connected to MongoDB successful"))
		.catch((err) => {
			console.log(`Failed in connectDB funcion: ${err}`);
			process.exit(-1);
		});
}
