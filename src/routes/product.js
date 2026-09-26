const express = require("express");
const { verifyToken } = require("../Middlewares/authentication");
const { randomId } = require("../utils/global");
const { Users } = require("../models/auth");
const { Products } = require("../models/product");
const cloudinary = require("../config/cloudinary");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post("/create", verifyToken, upload.fields([{ name: "image" }]), async (req, res) => {

    try {

        const uid = req.uid;

        const user = await Users.findOne({ uid });

        if (!user) {
            return res.status(404).json({ message: "User does not exist", isError: true })
        }

        const role = user.role;

        if (role === "Super Admin" || role === "Admin") {

            const { title, stock, category, price, description } = req.body;
            // const {productData} = req.body;

            let imageURL = "", imagePublicId = ""

            if (req.files && req.files["image"] && req.files["image"][0]) {

                const fileBuffer = req.files["image"][0].buffer;

                if (!fileBuffer) {
                    return res.status(400).json({ message: "File buffer missing. Check Multer configuration.", isError: true });
                }

                await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder: "velora/images/" },
                        (error, result) => {
                            if (error) {
                                return reject(error)
                            }
                            imageURL = result.secure_url,
                            imagePublicId = result.public_id,
                            resolve();
                        }
                    )
                    uploadStream.end(fileBuffer);
                })
            }

            const id = randomId();

            const newProduct = { id, title, stock, category, price, description, uid, user_role: role, imageURL, imagePublicId };

            const product = await Products(newProduct);

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