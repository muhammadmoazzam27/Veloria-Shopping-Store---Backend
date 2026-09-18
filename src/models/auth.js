const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        uid: { type: String, required: true, trim: true, uinque: true },
        email: { type: String, required: true, trim: true, uinque: true },
        fullName: { type: String, required: true, trim: true },
        password: { type: String, required: true, trim: true },
        status: { type: String, required: true, trim: true, enum: ["Active", "In-Active"], default: "Active" },
        role: { type: String, required: true, trim: true, enum: ["Super Admin", "Admin", "Customer"], default: "Admin" },
    },
    { timestamps: true }
);

const Users = mongoose.model("users", userSchema);

module.exports = { Users };