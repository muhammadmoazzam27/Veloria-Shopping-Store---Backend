const express = require("express");
const { Orders } = require("../models/orders");
const { verifyToken } = require("../Middlewares/authentication");

const router = express.Router();

router.post("/create", verifyToken, async(req,res)=>{

})


module.exports = router;