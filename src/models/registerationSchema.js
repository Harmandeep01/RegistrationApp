const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Import bcryptjs
const jwt = require("jsonwebtoken");

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
    confirmpassword: {
        type: String,
        required: true,
        minlength: 8
    },
    tokens : [{
        token : {
            type: String,
            required: true}
    }],
    date : {
        type: Date,
        default: Date.now
    }
});

registerationSchema.methods.generateAuthToken = async function() {
    try{
        const token =  jwt.sign({_id:this._id.toString()}, '44c0ef040b76895cc2253072d987e55cda26d2301ff60c88cffaee16cbe80ca2a72d8fa2b6d4d5b653dfa29e77a682093cbfc10a414a5eb2b83bc292f5bf0e7e0afc389ad53aa28500b33ea01911214f8200da7ec7c90279f942a0dab9cca9f0398623d42381657958237f505a9b57f192e68340d8b5c1022f6c3366cc1c85a7788f6f3066cb5cae8593409745eb7c389bd0d954260a715cb82064c1f4bccd98c41aa2a1dbded4361fd7b3fa9bcc027bf40ded2bae633ff35c87f72d77716daeb7de8d97456a0d5f9f3f695a3164450868f230177fc91222d11e138551fb46bff537dc93737f4431610a8b10c05a9c2e7858be8f3686382019b9faee9b9af19a');
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    }catch(error) {
        console.log(error);
    }
};


registerationSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
            this.password = await bcrypt.hash(this.password, 10);
            this.confirmpassword = await bcrypt.hash(this.password, 10);
    }

    next();
});

const Register = new mongoose.model("Registration", registerationSchema);

module.exports = Register;