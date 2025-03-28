const express = require("express")
const router = express.Router()
const User = require("../model/user.model.js");
const bcrypt = require("bcrypt")
const { isValidateSignUpData } = require("../utils/validator.js");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try {
        isValidateSignUpData(req); // Ensure this throws an error if validation fails
        const { firstName, lastName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        const savedUser = await user.save();
        const token = await savedUser.getJWT();
        res.cookie("token", token, {
            expires: new Date(Date.now() + 86400000),
            httpOnly: true, // Prevent client-side access
        });
        res.json({ msg: "User successfully registered", data: savedUser });
    } catch (error) {
        console.error("Error in user registration:", error);
        res.status(400).json({ error: error.message });
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }

        const token = await user.getJWT();
        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000),
            httpOnly: true,
            
        });
        res.json({ msg: "Login successful", data: user });
    } catch (err) {
        console.error("Error in user login:", err);
        res.status(500).json({ error: err.message });
    }
});


authRouter.post("/logout" ,async (req,res)=>{

    res.cookie("token",null,{
        expires:new Date(Date.now()),
    })
    res.send("logout Sucessfully !!")
})
module.exports = authRouter;
