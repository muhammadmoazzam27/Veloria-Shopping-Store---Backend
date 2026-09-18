require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { connectDB } = require("./src/config/db");
const  auth  = require("./src/routes/auth");

const PORT = process.env.PORT

app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/auth", auth)

app.get("/", (req,res)=>{
    res.send("E-Commerce Web Application")
})

app.get("/health", (req,res)=>{
    res.send("A Server health is Good")
})

app.listen(PORT, (req,res)=>{
    console.log(`A server is Running on PORT ${PORT}`)
})