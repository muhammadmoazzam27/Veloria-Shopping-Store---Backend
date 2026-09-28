const mongoose = require("mongoose");

const { Schema } = mongoose;

const orderSchema = new Schema({
    admin_id: { type: String, required: true, trim: true },
    customer_id: { type: String, required: true, trim: true },
    order_id: { type: String, required: true, trim: true, unique: true },
    title: { type: String, required: true, trim: true },
    imageURL: { type: String, required: true, trim: true },
    price: { type: String, required: true, trim: true },
    quantity: { type: String, required: true, trim: true },
    status: { type: String, enum: ["Pending", "Shipped", "Delivered"], default:"Pending", required: true, trim: true }
})

const Orders = mongoose.model("orders", orderSchema);

module.exports = { Orders };