import jwt from "jsonwebtoken";

export const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

export const tokenExtractor = (request, response, next) => {
  console.log("Token extractor toimii")
  if (!request.headers.authorization){
    console.log("Headeri tyhjä, seuraavaksi next?")
    return next();
  }
  console.log("Headerissa jotain, käsitellään tokeni")
  const token = request.headers.authorization.split(" ").pop()
  request.userId = jwt.verify(token, process.env.SECRET).id;
  next();
};