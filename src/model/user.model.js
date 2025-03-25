const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            minLength: [2, "First name must be at least 2 characters"],
            maxLength: [50, "First name cannot exceed 50 characters"],
            trim: true
        },
        lastName: {
            type: String,
            trim: true,
            maxLength: [50, "Last name cannot exceed 50 characters"]
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            validate: {
                validator: validator.isEmail,
                message: "Please provide a valid email address"
            }
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minLength: [8, "Password must be at least 8 characters"],
            validate: {
                validator: function(value) {
                    return validator.isStrongPassword(value, {
                        minLength: 8,
                        minLowercase: 1,
                        minUppercase: 1,
                        minNumbers: 1,
                        minSymbols: 1
                    });
                },
                message: "Password must contain at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol"
            }
        },
        age: {
            type: Number,
            min: [13, "You must be at least 13 years old"],
            max: [90, "Please enter a valid age"]
        },
        gender: {
            type: String,
            lowercase: true,
            trim: true,
            validate: {
                validator: function(value) {
                    return ["male", "female", "other"].includes(value);
                },
                message: "Please provide a valid gender"
            }
        },
        photoURL: {
            type: String,
            default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", // generic avatar
            validate: {
                validator: validator.isURL,
                message: "Please provide a valid URL for the photo"
            }
        },
        about: {
            type: String,
            default: "Hey there! I am using Social Media App",
            maxLength: [500, "About section cannot exceed 500 characters"]
        }
    },
    { 
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: function(doc, ret) {
                delete ret.password; // Never send password in responses
                return ret;
            }
        },
        toObject: {
            virtuals: true,
            transform: function(doc, ret) {
                delete ret.password;
                return ret;
            }
        }
    }
);

module.exports = mongoose.model("User", userSchema);