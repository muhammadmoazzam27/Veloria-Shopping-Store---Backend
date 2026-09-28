const express = require("express");
const { Orders } = require("../models/orders");
const { verifyToken } = require("../Middlewares/authentication");

const router = express.Router();

router.post("/create", verifyToken, async (req, res) => {
    try {
        const user = req.user; // verifyToken middleware me req.user set hota hai

        // Condition: Sirf 'Customer' hi order place kar sakta hai
        if (user.role !== "Customer") {
            return res.status(403).json({
                success: false,
                message: "Access Denied: Admins and Super Admins cannot place orders.",
            });
        }

        const { cartItems } = req.body;

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty.",
            });
        }

        const createdOrders = [];

        for (const item of cartItems) {
            const generatedOrderId = `ORD-${Date.now()}-${Math.floor(
                1000 + Math.random() * 9000
            )}`;

            const newOrder = new Orders({
                admin_id: String(item.admin_id),
                customer_id: String(user.uid || user._id),
                order_id: generatedOrderId,
                title: item.title,
                imageURL: item.imageURL,
                price: String(item.price),
                quantity: String(item.qty || item.quantity || 1),
                status: "Pending",
            });

            const savedOrder = await newOrder.save();
            createdOrders.push(savedOrder);
        }

        return res.status(201).json({
            success: true,
            message: "Order(s) placed successfully!",
            orders: createdOrders,
        });
    } catch (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while placing order.",
            error: error.message,
        });
    }
});

module.exports = router;