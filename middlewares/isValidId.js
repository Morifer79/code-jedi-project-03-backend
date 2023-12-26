import { isValidObjectId } from "mongoose";
import { HttpError } from "../helpers/index.js";

export const isValidId = (req, res, next) => {
    const { consumedWaterId } = req.params;
    if (!isValidObjectId(consumedWaterId)) {
        return next(HttpError(404, `Record with id=${consumedWaterId} not found`))
    }
    next();
}