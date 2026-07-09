import mongoose from "mongoose";

const executionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  registerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Register",
    required: true,
  },
  actionType: {
    type: String,
    enum: ["update"],
    default: "update",
  },
  executedAt: {
    type: Date,
    default: Date.now,
  },
});

const Execution = mongoose.model("Execution", executionSchema);

export default Execution;
