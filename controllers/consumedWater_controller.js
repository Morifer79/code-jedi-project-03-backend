import { ctrlWrapper } from "../decorators/index.js";
import { consumedWater } from "../db/models/consumedWater.js";

const getAllConsumedWaterToday = async (req, res) => {
  const { date, month } = req.params;
  const { _id: owner } = req.user;
  const allWaterList = await consumedWater.find({ owner, date, month, percent }, "waterVolume time")
  res.json(allWaterList);
}


const getAllConsumedWaterMonth = async (req, res) => {
  const { month } = req.params;
  const { _id: owner } = req.user;
  const allConsumedWaterList = await consumedWater.aggregate([

    {
      $match: {owner,  month }
    },

    {
      $group: {
        _id: "$date",
        totalProcent: { $sum: "$percent" },
        count: { $sum: 1 }
      },
    },
    {
      $project: {
        _id: `${owner}`,
        month: `${month}`,
        date: "$_id",
        totalProcent: "$totalProcent",
        numOfWaterRecords: "$count"
      }
    },
  ]);
  res.json(allConsumedWaterList);
}

const addConsumedWater = async (req, res) => {
  const { _id: owner } = req.user;
  const newConsumedWater = await consumedWater.create({ ...req.body, owner });
  res.status(201).json(newConsumedWater);
}

const updateConsumedWaterId = async (req, res) => {

  const { consumedWaterId } = req.params;
  const { _id: owner } = req.user;
  const updateConsumedWater = await consumedWater.findByIdAndUpdate({ _id: consumedWaterId, owner }, req.body);
  if (!updateConsumedWater) {
       res.status(404).json({
  message: `Water record with id=${consumedWaterId} not found`,
});
return;
  }
  res.json(updateConsumedWater);
}


const deleteConsumedWaterId = async (req, res) => {
  const { consumedWaterId } = req.params;
  const { _id: owner } = req.user;
  const removeConsumedWaterRecord = await consumedWater.findOneAndDelete({ _id: consumedWaterId, owner })
  if (!removeConsumedWaterRecord) {
       res.status(404).json({
  message: `Water record with id=${consumedWaterId} not found`,
});
return;
  }
  res.json({ message: "Deleted success" });
}


export default {
  getAllConsumedWaterToday: ctrlWrapper(getAllConsumedWaterToday),
  getAllConsumedWaterMonth: ctrlWrapper(getAllConsumedWaterMonth),
  addConsumedWater: ctrlWrapper(addConsumedWater),
  updateConsumedWaterId: ctrlWrapper(updateConsumedWaterId),
  deleteConsumedWaterId: ctrlWrapper(deleteConsumedWaterId)
};