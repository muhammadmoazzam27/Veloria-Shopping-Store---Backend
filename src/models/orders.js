const mongoose = require('mongoose')

const { Schema } = mongoose

const orderSchema = new Schema(
  {
    admin_id: {
      type: String,
      required: true,
      trim: true,
    },

    customer_id: {
      type: String,
      required: true,
      trim: true,
    },

    order_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    product_id: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    imageURL: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ['Pending', 'Shipped', 'Delivered'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
)

const Orders = mongoose.model('orders', orderSchema)

module.exports = { Orders }