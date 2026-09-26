const express = require("express");
const { verifyToken } = require("../Middlewares/authentication");
const { randomId } = require("../utils/global");
const { Users } = require("../models/auth");
const { Products } = require("../models/product");

const router = express.Router();

router.post("/create", verifyToken, async (req, res) => {

    try {

        const uid = req.uid;

        const user = await Users.findOne({ uid });

        if (!user) {
            return res.status(404).json({ message: "User does not exist", isError: true })
        }

        const role = user.role;

        if (role === "Super Admin" || role === "Admin") {

            const { title, stock, category, price, description } = req.body;

            const id = randomId();

            const productData = { id, title, stock, category, price, description, uid, user_role: role };

            const product = await Products(productData);

            await product.save();

            return res.status(201).json({ message: "A product successfully created", product, isError: false })

        }

        return res.status(401).json({ message: "User not allowed the access", isError: true })

    }
    catch (error) {
        console.error("Error : ", error);
        return res.status(500).json({ message: "Something went wrong", isError: true })
    }

})

router.get("/get/all/products", verifyToken, async (req, res) => {

    try {

        const uid = req.uid;

        const user = await Users.findOne({ uid });

        if (!user) {
            return res.status(404).json({ message: "User does not exist", isError: true })
        }

        const role = user.role;

        if (role === "Super Admin") {

            const allProducts = await Products.find({})

            return res.status(200).json({ message: "All products fetched successfully", allProducts, isError: false })

        }
        else if (role === "Admin") {
            const allProducts = await Products.find({ uid })

            return res.status(200).json({ message: "All products fetched successfully", allProducts, isError: false })
        }

        return res.status(401).json({ message: "User not allowed the access", isError: true })

    }
    catch (error) {
        console.error("Error : ", error);
        return res.status(500).json({ message: "Something went wrong", isError: true })
    }
})

router.patch("/update/single/product/:id", verifyToken, async (req, res) => {

    try {

        const uid = req.uid;
        const { id } = req.params;

        const user = await Users.findOne({ uid });

        if (!user) {
            return res.status(404).json({ message: "User does not exist", isError: true })
        }

        const role = user.role;

        if (role === "Super Admin" || role === "Admin") {

            const { title, stock, price, category, description } = req.body;

            const product = { title, stock, price, category, description };

            const updatedProduct = await Products.findOneAndUpdate({ id }, product, { returnDocument: 'after' })

            return res.status(200).json({ message: "Product successfully updated", updatedProduct, isError: false })

        }

        return res.status(401).json({ message: "User not allowed the access", isError: true })

    }
    catch (error) {
        console.error("Error : ", error);
        return res.status(500).json({ message: "Something went wrong", isError: true })
    }

})

router.delete("/delete/product/:id", verifyToken, async (req, res) => {

    try {

        const uid = req.uid;

        const { id } = req.params;

        const user = await Users.findOne({ uid });

        if (!user) {
            return res.status(404).json({ message: "User does not exist", isError: true })
        }

        const role = user.role;

        if (role === "Super Admin" || role === "Admin") {

            const deletedProduct = await Products.findOneAndDelete({ id });

            return res.status(200).json({ message: "A product successfully deleted", deletedProduct, isError: false })

        }

        return res.status(401).json({ message: "User not allowed the access", isError: true })

    }
    catch (error) {
        console.error("Error : ", error);
        return res.status(500).json({ message: "Something went wrong", isError: true })
    }

})


module.exports = router;