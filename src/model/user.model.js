const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error("Invalid email");
                }
            }
        },
        password: {
            type: String,
            required: true,
            validate(value){
                if(!validator.isStrongPassword(value)){
                    throw new Error("Password is not strong");
                }
            }
        },
        age: {
            type: Number,
            // required: true
        },
        gender: {
            type: String,
            validate(value) {
                if (!["male", "female", "others"].includes(value)) {
                    throw new Error("Invalid gender");
                }
            }
            // required: true
        },
        photoURL:{
            type: String,
            default: "https://www.pinterest.com/pin/my-passport-size-photo--676384437794183271/",
            validate(value){
                if(!validator.isURL(value)){
                    throw new Error("Invalid URL");
                }
            }
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);