import mongoose from "mongoose";

export async function connectDB() {
  try {
await mongoose.connect(
  "mongodb://ggmaxvendacc_db_user:PYNtC01jtju6pwRm@ac-8xa7ktv-shard-00-00.ybvl6z4.mongodb.net:27017,ac-8xa7ktv-shard-00-01.ybvl6z4.mongodb.net:27017,ac-8xa7ktv-shard-00-02.ybvl6z4.mongodb.net:27017/ride-app?ssl=true&replicaSet=atlas-e50y41-shard-0&authSource=admin&retryWrites=true&w=majority"
);

    console.log("🟢 MongoDB conectado");
  } catch (err) {
    console.error("🔴 Erro Mongo:", err);
  }
}