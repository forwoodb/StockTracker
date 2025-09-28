import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  ticker: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: false,
  },
  positionSize: {
    type: Number,
    required: false,
  },
  averageCost: {
    type: Number,
    required: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    // Not required for now
    required: false,
  },
  watchList: {
    type: Boolean,
    default: true,
  },
  position: {
    type: Boolean,
    default: false,
  },
});

export const Stock = mongoose.model("Stock", stockSchema);
