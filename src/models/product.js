const mongoose = require("mongoose");

const { Schema } = mongoose;

const productSchema = new Schema({
    uid: { type: String, required: true, trim: true },
    id: { type: String, required: true, trim: true, unique: true },
    title: { type: String, required: true, trim: true },
    user_role: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, trim: true },
    price: { type: Number, required: true, trim: true },
    // imageURL: { type: String, required: true, trim: true },
    // public_id: { type: String, required: true, trim: true },
},
    { timestamps: true })

const Products = mongoose.model("products", productSchema)

module.exports = { Products }