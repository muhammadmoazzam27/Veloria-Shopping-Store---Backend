const express = require("express");
const { Orders } = require("../models/orders");
const { verifyToken } = require("../Middlewares/authentication");
const { Users } = require("../models/auth");
const { randomId } = require("../utils/global");

const router = express.Router();

router.post('/create-order', verifyToken, async (req, res) => {
    try {

        const uid = req.uid;
        const user = await Users.findOne({ uid });

        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }
        const role = user.role;

        const { cartItems } = req.body;

        const customer_id = req.uid

        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        const newOrder = new Orders({
            admin_id: item.uid,
            customer_id: customer_id,
            order_id: randomId(),
            product_id: item.product.id,
            title: item.title,
            imageURL: item.imageURL,
            price: item.price,
            quantity: item.quantity,
        });

        const createOrder = await newOrder.save();

        return res.status(201).json({ success: true, message: 'Order created successfully', orders: createOrder });

    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

module.exports = router;