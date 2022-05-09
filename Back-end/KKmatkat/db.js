import mongoose from "mongoose";
import { MONGODB_URI } from "./utils/config.js";

export const connectToDb = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("connected to mongodb");
  } catch (err) {
    console.log("error connecting to MongoDB:", error.message);
  }
};
