import mongoose from "mongoose";

const Storage = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    link: {type: String, required: true, unique: true},
    fileName: {type: String, required: true},
    isPublic: {type: Boolean, default: true},
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    size: {type: Number, required: true},
});

export default mongoose.model("storage", Storage);
