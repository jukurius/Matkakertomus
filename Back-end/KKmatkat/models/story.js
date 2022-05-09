import mongoose from "mongoose";


/** Käyttäjä tarinan SCHEMA ja muotoilu */

const storySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sight: { type: mongoose.Schema.Types.ObjectId, ref: "Sight" },
  description: String,
  picture: String,
  date: Date,
  private: Boolean
});

storySchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Story = mongoose.model("Story", storySchema);

export default Story;
