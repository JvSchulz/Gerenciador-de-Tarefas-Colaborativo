import mongoose from "mongoose";

const sharingSchema = new mongoose.Schema({
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
  permission: {
    type: String,
    enum: ["read", "write"],
    required: true,
  },
  sharedAt: {
    type: Date,
    default: Date.now,
  },
});

const Sharing = mongoose.model("Sharing", sharingSchema);

export default Sharing;
