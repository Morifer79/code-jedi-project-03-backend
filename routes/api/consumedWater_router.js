import express from "express";
import  consumedWater_controller  from "../../controllers/consumedWater_controller.js";
import { isEmptyBody } from "../../middlewares/isEmptyBody.js";
import { isValidId } from "../../middlewares/isValidId.js";
import { validateBody } from "../../decorator/validateBody.js";
import { addConsumedWaterSchema, updateConsumedWaterSchema } from "../../db/models/consumedWater.js"
// import authenticate from "../../middlewares/authenticate.js";

const consumedWaterRouter = express.Router();

// waterRouter.use(authenticate);

consumedWaterRouter.get('/today/:day/:month', consumedWater_controller.getAllСonsumedWaterToday);

consumedWaterRouter.get('/month/:month', consumedWater_controller.getAllСonsumedWaterMonth);

consumedWaterRouter.post('/today', isEmptyBody, validateBody(addConsumedWaterSchema), consumedWater_controller.addСonsumedWater);

consumedWaterRouter.put('/today/:consumedWaterId', isValidId, isEmptyBody, validateBody(updateConsumedWaterSchema), consumedWater_controller.updateСonsumedWaterId);

consumedWaterRouter.delete('/today/:consumedWaterId', isValidId, consumedWater_controller.deleteСonsumedWaterId)

export default consumedWaterRouter;