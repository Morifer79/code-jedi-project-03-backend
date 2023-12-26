import express from "express";
import logger from "morgan";
import cors from "cors";
import "dotenv/config";

import consumedWaterRouter from './routes/api/consumedWater_router.js';
// import userRouter from "./routes/api/users";

const app = express()


const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use(express.static("public"));

// app.use("/users", userRouter);
app.use("/consumedWater", consumedWaterRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, _, res) => {
  res.status(500).json({ message: err.message });
});

export default app
