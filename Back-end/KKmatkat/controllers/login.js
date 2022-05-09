import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const loginRouter = Router();

/** Kirjautumismoduuli */

loginRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({ email: body.email })
  const pwCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && pwCorrect)) {
    return response.status(401).json({
      error: 'invalid email or password'
    })
  }
  const userForToken = {
    email: user.email,
    id: user._id,
  }
const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, email: user.email, firstname: user.firstname, surname: user.surname, locality: user.locality, username:user.username, introduction: user.introduction, imageUrl: user.imageUrl, sights: user.sights, id: user.id})
})

export default loginRouter;