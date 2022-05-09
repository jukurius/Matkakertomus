import express from "express";
import sightsRouter from "./controllers/sights.js";
import storiesRouter from "./controllers/stories.js";
import usersRouter from "./controllers/users.js";
import loginRouter from "./controllers/login.js";

import { unknownEndpoint, tokenExtractor} from "./utils/middleware.js";
import { connectToDb } from "./db.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

await connectToDb();

app.use(tokenExtractor);
app.use("/mo", (req, res) => res.send("boi")); //testi
app.use("/api/sights", sightsRouter);
app.use("/api/stories", storiesRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);


app.use(unknownEndpoint);


export default app;
