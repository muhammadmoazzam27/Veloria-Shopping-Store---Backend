const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { randomId } = require("../utils/global");
const { Users } = require("../models/auth");
const { verifyToken } = require("../Middlewares/authentication");

const SECRET_KEY = process.env.Secret_key

const router = express.Router();

router.post("/register", async (req, res) => {

    try {

        const { fullName, email, password, role } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required", isError: true })
        }

        const userFound = await Users.findOne({ email })

        if (userFound) {
            return res.status(403).json({ message: "A user already exist", isError: true })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const uid = randomId()

        const userData = { uid, fullName, email, password: hashPassword, role };

        const user = await Users(userData);

        await user.save();

        return res.status(201).json({ message: "A user successfully registered", user, isError: false });

    }
    catch (error) {
        console.log("Error", error);
        return res.status(500).json({ message: "Something went wrong", isError: true })
    }


});


router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await Users.findOne({ email })

        if (!user) {
            return res.status(404).json({ message: "A user does not exist", isError: true })
        }

        const match = await bcrypt.compare(password, user.password)

        if (match) {

            const uid = user.uid;

            const token = await jwt.sign({ uid }, `${SECRET_KEY}`, { expiresIn: "1h" })

            const status = user.status;

            if(status === "In Active"){
                return res.status(403).json({ message: "Your status is not active", isError: true })
            }

            return res.status(200).json({ message: "A user successfully login", token, isError: false })

        }

        return res.status(401).json({ message: "Invalid email or password", isError: true })

    }
    catch (error) {
        console.log("Error", error);
        return res.status(500).json({ message: "Something went wrong", isError: true })
    }

})


router.get("/user", verifyToken, async (req, res) => {

    try {

        const uid = req.uid;

        const user = await Users.findOne({ uid })

        if (!user) {
            return res.status(404).json({ message: "User not found", isError: true })
        }

        return res.status(200).json({ message: "login successful", user, isError: false })

    }
    catch (error) {
        console.log("Error", error);
        return res.status(500).json({ message: "Something went wrong", isError: true })
    }

})


router.get("/get/user/single", verifyToken, async (req, res) => {

    try {

        const uid = req.uid;
        const role = req.role;

        const user = await Users.findOne({ uid })

        if (!user) {
            return res.status(404).json({ message: "User not found", isError: true })
        }

        const Role = user.role;

        return res.status(200).json({ message: "User fetched successful", user, Role, isError: false })

    }
    catch (error) {
        console.log("Error", error);
        return res.status(500).json({ message: "Something went wrong", isError: true })
    }

})


router.get("/get/all/users", verifyToken, async (req, res) => {

    try {

        const uid = req.uid;

        const user = await Users.findOne({ uid });

        const role = user.role;

        if (role == "Super Admin") {

            const allUsers = await Users.find({})

            if (!allUsers) {
                return res.status(404).json({ message: "Users not found", isError: true })
            }

            return res.status(200).json({ message: "Users fetched Successfully", allUsers, isError: false })

        }

        return res.status(401).json({ message: "Unauthorized user", isError: true })

    }
    catch (error) {
        console.log("Error", error);
        return res.status(500).json({ message: "Something went wrong", isError: true })
    }


})

router.patch("/update/user/single/:uid", verifyToken, async (req, res) => {
    try {

        const uid = req.uid;
        const user = await Users.findOne({ uid });

        if (!user) {
            return res.status(404).json({ message: "User not found", isError: true });
        }

        if (user.role === "Super Admin") {

            const { uid } = req.params;
            const { fullName, email, status, role } = req.body;

            const newUser = { fullName, email, status, role };

            const updatedUser = await Users.findOneAndUpdate({ uid }, newUser, { returnDocument: 'after' });

            if (!updatedUser) {
                return res.status(404).json({ message: "User to update not found", isError: true });
            }

            return res.status(200).json({ message: "User updated successfully", updatedUser, isError: false });
        }

        return res.status(403).json({ message: "Access Denied: Only Super Admin can update users", isError: true });

    } catch (error) {
        console.error("Error updating single user:", error);
        return res.status(500).json({ message: "Something went wrong", isError: true });
    }
});


router.delete("/delete/user/single/:uid", verifyToken, async (req, res) => {
    try {

        const uid = req.uid;
        const user = await Users.findOne({ uid })

        if (!user) {
            return res.status(404).json({ message: "User not found", isError: true });
        }

        if (user.role === "Super Admin") {

            const { uid } = req.params;

            const deleteUser = await Users.findOneAndDelete({ uid });

            if (!deleteUser) {
                return res.status(404).json({ message: "User to delete not found", isError: true });
            }

            return res.status(200).json({ message: "User deleted successfully", deleteUser, isError: false });
        }

        return res.status(403).json({ message: "Access Denied: Only Super Admin can update users", isError: true });

    } catch (error) {
        console.error("Error updating single user:", error);
        return res.status(500).json({ message: "Something went wrong", isError: true });
    }
});



module.exports = router;