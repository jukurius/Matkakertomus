import mongoose from "mongoose";

/** Matkakohteen SCHEMA ja muotoilu */

const sightSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  destination: String,
  country: String,
  city: String,
  description: String,
  picture: String,
  date: Date,
  private: Boolean
});

sightSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Sight = mongoose.model("Sight", sightSchema);

export default Sight;
