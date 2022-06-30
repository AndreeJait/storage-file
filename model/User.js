import mongoose from "mongoose";

const User = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  key: { type: String, required: true },
  role: { type: String, default: "Publisher" },
  phoneNumber: { type: String },
});

export default mongoose.model("user", User);
