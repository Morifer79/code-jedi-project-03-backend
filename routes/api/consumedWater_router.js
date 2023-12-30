import express from "express";
import  consumedWater_controller  from "../../controllers/consumedWater_controller.js";
import { isEmptyBody } from "../../middlewares/index.js";
import { isValidId } from "../../middlewares/isValidId.js";
import  validateBody  from "../../decorators/validateBody.js";
import { addConsumedWaterSchema, updateConsumedWaterSchema } from "../../db/models/consumedWater.js"
import authenticate from "../../middlewares/authenticate.js";

const consumedWaterRouter = express.Router();

 consumedWaterRouter.use(authenticate);

consumedWaterRouter.get('/today/:date/:month', consumedWater_controller.getAllConsumedWaterToday);

consumedWaterRouter.get('/month/:month', consumedWater_controller.getAllConsumedWaterMonth);

consumedWaterRouter.post('/today', isEmptyBody, validateBody(addConsumedWaterSchema), consumedWater_controller.addConsumedWater);

consumedWaterRouter.put('/today/:consumedWaterId', isValidId, isEmptyBody, validateBody(updateConsumedWaterSchema), consumedWater_controller.updateConsumedWaterId);

consumedWaterRouter.delete('/today/:consumedWaterId', isValidId, consumedWater_controller.deleteConsumedWaterId)

export default consumedWaterRouter;