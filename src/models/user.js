import mongoose from "mongoose";

const userScema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required:true, unique: true },
        password: { type: String, required:true },
        role: {
            type: String,
            enum: ["admin", "reader", "author"],
            default: "reader"
        },
        bio: {
          type: String,
          default: "",
        },
        isRestricted: {
            type: Boolean,
            default: false,
        },
        isActive: { type: Boolean, default: true },
    },
    {timestamps: true}
)

export default mongoose.model("User", userScema);