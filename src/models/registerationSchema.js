const mongoose = require("mongoose");

const registerationSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    date : {
        type: Date,
        default: Date.now
    }
});

const Register = new mongoose.model("Registration", registerationSchema);

module.exports = Register;