import express from "express";
import consumedWaterController from "../../controllers/consumedWater_controller.js";
import { isEmptyBody } from "../../middlewares/index.js";
import { isValidId } from "../../middlewares/isValidId.js";
import validateBody from "../../decorators/validateBody.js";
import { addConsumedWaterSchema, updateConsumedWaterSchema } from "../../db/models/consumedWater.js"
import authenticate from "../../middlewares/authenticate.js";

const consumedWaterRouter = express.Router();

consumedWaterRouter.use(authenticate);

consumedWaterRouter.get('/today/:date/:month', consumedWaterController.getAllConsumedWaterToday);

consumedWaterRouter.get('/month/:month', consumedWaterController.getAllConsumedWaterMonth);

consumedWaterRouter.post('/today', isEmptyBody, validateBody(addConsumedWaterSchema), consumedWaterController.addConsumedWater);

consumedWaterRouter.put('/today/:consumedWaterId', isValidId, isEmptyBody, validateBody(updateConsumedWaterSchema), consumedWaterController.updateConsumedWaterId);

consumedWaterRouter.delete('/today/:consumedWaterId', isValidId, consumedWaterController.deleteConsumedWaterId)

export default consumedWaterRouter;