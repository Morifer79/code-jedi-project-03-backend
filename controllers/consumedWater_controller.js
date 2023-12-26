import { HttpError } from "../helpers/index.js";
import { ctrlWrapper }  from "../decorators/index.js";
import { consumedWater } from "../db/models/consumedWater.js";

const getAllСonsumedWaterToday = async (req, res) => {
  const { day, month } = req.params;
  console.log(day);
  console.log(month);
  const { _id: owner} = req.user;
  const allWaterList = await consumedWater.find({ date: `${day}`, month:`${month}`
}, "amount time ")
  
  res.json(allWaterList);
}


const getAllСonsumedWaterMonth = async (req, res) => {
  const {month } = req.params;
  // const { _id: owner, month } = req.user;
  const allСonsumedWaterList = await consumedWater. aggregate([
    {
      $group: {
        _id: {month:`${month}`},
        totalProcent: { $sum: "$percent" },
        count: { $sum: 1 }
        
    }}
]);
  res.json(allСonsumedWaterList);
}

const addСonsumedWater = async (req, res) => {
//   const { _id: owner } = req.user;
    const newСonsumedWater = await consumedWater.create({ ...req.body });
  res.status(201).json(newСonsumedWater);
}

const updateСonsumedWaterId = async (req, res) => {
  
    const { consumedWaterId } = req.params;
    console.log(consumedWaterId);
//   const { _id: owner } = req.user;
  const updateСonsumedWater = await consumedWater.findByIdAndUpdate( consumedWaterId, req.body);
  if (!updateСonsumedWater) {
    throw HttpError(404, `Water record with id=${consumedWaterId} not found`);
  }
  res.json(updateСonsumedWater);
}


const deleteСonsumedWaterId = async (req, res) => {
  const { consumedWaterId } = req.params;
  // const { _id: owner } = req.user;
  const removeСonsumedWaterRecord = await consumedWater.findOneAndDelete({ _id: consumedWaterId })
  if (!removeСonsumedWaterRecord) {
    throw HttpError(404, `Water record with id=${consumedWaterId} not found`);
  }
  res.json({ message: "Deleted success" });
}


export default {
  getAllСonsumedWaterToday: ctrlWrapper(getAllСonsumedWaterToday),
getAllСonsumedWaterMonth: ctrlWrapper(getAllСonsumedWaterMonth),
  addСonsumedWater: ctrlWrapper(addСonsumedWater),
  updateСonsumedWaterId: ctrlWrapper(updateСonsumedWaterId),
   deleteСonsumedWaterId: ctrlWrapper(deleteСonsumedWaterId)
};