import mongoose from "mongoose";

const RideSchema = new mongoose.Schema({
  userId: String,
  origin: String,
  destination: String,
  price: Number,
  status: {
    type: String,
    default: "requested"
  }
});

export default mongoose.model("Ride", RideSchema);