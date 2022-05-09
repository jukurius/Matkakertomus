import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Story from "../models/story.js";
import {deleteStory, updateStory} from "../services/Stories.js"


const storiesRouter = Router();

/** Matkakohteen CRUD operaatiot */
storiesRouter.get("/", async (request, response) => {
  const story = await Story.find({}).populate("user") //asd?
  return response.json(story);
});

storiesRouter.delete("/:id", async (request, response) => {
  const story = await deleteStory(request.params.id, request.userId)
  return response.json(story);
});

storiesRouter.put("/:id", async (request, response) => {
  console.log("userid: " + request.userId)
  console.log("sightid: " + request.params.id)
  const story = await updateStory(request.params.id, request.userId, request.body)
  return response.json(story);
});

storiesRouter.post("/", async (request, response) => {
  const body = request.body;

  if (body.sightId === undefined) {
    return response.status(400).json({ error: "sight missing" });
  }
 
  if (body.description === undefined) {
    return response.status(400).json({ error: "description missing" });
  }
  if (body.picture === undefined) {
    return response.status(400).json({ error: "picture missing" });
  }

  const token = request.headers.authorization.split(" ").pop()
  const id = jwt.verify(token, process.env.SECRET);


  const story = new Story({
    description: body.description,
    picture: body.picture, 
    user: id.id,
    sight: body.sightId,
    date: new Date(),
    private: body.private
  });

  const savedStory = await story.save();
  await User.findOneAndUpdate({email:id.email},{$push:{stories:savedStory.id}})
  
  
  response.json(savedStory);
});

export default storiesRouter;