import mongoose from "mongoose";
import { mongodbURI, dbName } from "./envConfig.js";

async function dbConfig() {
    try {
        await mongoose.connect(`${mongodbURI}${dbName}`)
        console.log("DB connected successfully!");
    } catch (error) {
        console.error("DB Connection Failed: ", error);
    }
}

export default dbConfig;