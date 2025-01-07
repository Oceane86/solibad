// models/Item.js
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        startingPrice: {
            type: Number,
            required: true,
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        imagePath: {  
            type: String,
            default: "assets/default-item-image.png",
        },
    },
    { timestamps: true }
);

export default mongoose.models.Item || mongoose.model("Item", itemSchema);
