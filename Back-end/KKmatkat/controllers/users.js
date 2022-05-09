import bcrypt from "bcryptjs";
import { Router } from "express";
import User from "../models/user.js";
import {deleteUser, updateUser} from "../services/Users.js"
import jwt from "jsonwebtoken";

const usersRouter = Router();

usersRouter.delete("/:id", async (request, response) => {
  const user = await deleteUser(request.params.id, request.userId)
  return response.json(user);
});

usersRouter.put("/:id", async (request, response) => {
  console.log("userid: " + request.userId)
  const user = await updateUser(request.userId, request.body)
  return response.json(user);
});

usersRouter.post("/", async (request, response) => {
  const body = request.body;

  if (body.email === undefined) {
    return response.status(400).json({ error: "invalid email" }); // 400 errorit kaikista + check ?
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    email: body.email,
    username: body.username,
    firstname: body.firstname,
    surname: body.surname,
    imageUrl: body.imageUrl,
    locality: body.locality,
    date: new Date(),
    introduction: body.introduction,
    passwordHash,
  });

  const savedUser = await user.save();

  response.send(savedUser);
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.send(users);
});

const getAll = async (req, res) => {
  const users = await User.find({}).populate("sights");
  res.send(users);
};

export default usersRouter;
