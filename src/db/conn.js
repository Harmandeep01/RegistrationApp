const mongoose = require("mongoose");
require('dotenv').config();

const DB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {

        });
        if(!conn.connection.host || !conn.connection.port){
            throw new Error("IP address not assigned");
        }else{
            console.log(`MongoDB connected: ${conn.connection.host}:${conn.connection.port}`);
        }
    } catch (error) {
        console.log("Failed to connect", error.message);
    }
};

module.exports = DB;