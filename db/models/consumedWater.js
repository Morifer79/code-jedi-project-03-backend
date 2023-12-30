import { Schema, model } from "mongoose";
import { handleSaveError, preUpdate } from "./hooks.js";
import Joi from "joi";

const consumedWaterSchema = new Schema({
  waterVolume: {
    type: Number,
    min: 1,
    max: 5000
  },
  time: {
    type: String
  },
  date: {
    type: Number,
    min: 1,
    max: 31
  },
  month: {
    type: String,
    enum: ["January", "February", "March", "April", "May", "June", "July", "August",
      "September", "October", "November", "December"]
  },
  percent: {
    type: Number
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
},
  { versionKey: false, timestamps: true }
)

consumedWaterSchema.post("save", handleSaveError);
consumedWaterSchema.pre("findOneAndUpdate", preUpdate);
consumedWaterSchema.post("findOneAndUpdate", handleSaveError);

export const consumedWater = model("consumedWater", consumedWaterSchema);

export const addConsumedWaterSchema = Joi.object({
  waterVolume: Joi.number().required().messages({ "any.required": "missing required amount field" }),
  time: Joi.string().required().messages({ "any.required": "missing required time field" }),
  date: Joi.number().required().messages({ "any.required": "missing required date field" }),
  month: Joi.string().required().messages({ "any.required": "missing required month field" }),
  percent: Joi.number().required().messages({ "any.required": "missing required month field" }),
})

export const updateConsumedWaterSchema = Joi.object({
  waterVolume: Joi.number(),
  time: Joi.string(),
  date: Joi.number(),
  month: Joi.string(),
  percent: Joi.number()

})

