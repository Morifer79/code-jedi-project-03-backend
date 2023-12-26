
import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
// import waterRouter from "./routes/api/water_router.js";
// import userRouter from "./routes/api/user_router.js";

import consumedWaterRouter from './routes/api/consumedWater_router.js';
import userRouter from "./routes/api/users.js";

const swaggerJson = JSON.parse(
  fs.readFileSync(`./swagger.json`)
);

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerJson)
);



app.use("/users", userRouter);
app.use("/consumedWater", consumedWaterRouter);


app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});




export default app;

