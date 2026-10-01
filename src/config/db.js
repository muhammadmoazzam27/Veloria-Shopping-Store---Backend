// moazzambhatti186_db_user
// 9o8n0SwSWbwU0ipP
// mongodb+srv://<db_username>:9o8n0SwSWbwU0ipP@cluster0.qxi2wam.mongodb.net/?appName=Cluster0
//  mongodb://<db_username>:9o8n0SwSWbwU0ipP@ac-2ipp1fg-shard-00-00.qxi2wam.mongodb.net:27017,ac-2ipp1fg-shard-00-01.qxi2wam.mongodb.net:27017,ac-2ipp1fg-shard-00-02.qxi2wam.mongodb.net:27017/?ssl=true&replicaSet=atlas-119bj9-shard-0&authSource=admin&appName=Cluster0

require("dotenv").config();
const mongoose = require("mongoose");

const MONGODB_USERNAME = process.env.MongoDB_Username
const MONGODB_PASSWORD = process.env.MongoDB_Password

const connectDB = () => {

    mongoose.connect(`mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@ac-2ipp1fg-shard-00-00.qxi2wam.mongodb.net:27017,ac-2ipp1fg-shard-00-01.qxi2wam.mongodb.net:27017,ac-2ipp1fg-shard-00-02.qxi2wam.mongodb.net:27017/?ssl=true&replicaSet=atlas-119bj9-shard-0&authSource=admin&appName=Cluster0`)
        .then(() => {
            console.log("MongoDB successfully connected")
        })
        .catch((error) => {
            console.error("MongoDB not connected", error)
        })
}

module.exports = { connectDB }