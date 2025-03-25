const express = require('express');
const app = express();
const connectDB = require("./config/database.js");
const User = require("./model/user.model.js");
const { isValidateSignUpData } = require("./utils/validator.js");
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const{userAuth} = require("./middleware/auth.js");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
    try {
        isValidateSignUpData(req);
        const { firstName, lastName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        console.log(req.body);
        await user.save();
        res.send("User successfully registered");
    } catch (error) {
        console.error("Error in user registration", error);
        res.status(500).send("ERROR " + error.message);
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).send("User not found");
        }
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            const token = await user.getJWT();
            res.send("Logged in successfully");
        } else {
            res.status(401).send("Invalid password");
        }
    } catch (err) {
        res.status(500).send("Error " + err.message);
    }
});

app.get("/profile", userAuth,async (req, res) => {
    try{
       
       const user = req.user;
       res.send(user);
   
  }
    catch(err)
    {
        res.status(500).send("Error " + err.message);
    }    // console.log(cookies);
    // res.send("Reading cookies");
});

 app.post("/sendConnectionRequest",userAuth,(req,res)=>{
    try{
             const user  = req.user;
             res.send(user.firstName+ "Sending a connection Request" )
    } 
    catch(err){
        res.status(500).send("Error "+ err.message)
    }
 })

app.get("/users", async (req, res) => {
    const useremail = req.body.email;
    try {
        const users = await User.find({ email: useremail });

        if (users.length === 0) {
            return res.status(404).send("User not found");
        } else {
            res.send(users);
        }
    } catch (error) {
        console.error("Error in getting users", error);
        res.status(500).send("Internal Server Error");
    }
    console.log(useremail);
});

app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        console.error("Error in getting feed", error);
        res.status(500).send("Internal Server Error");
    }
});

app.patch("/users/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    try {
        const ALLOWED_UPDATES = [
            "gender",
            "age",
        ];

        const isAllowedUpdate = Object.keys(data).every(update => ALLOWED_UPDATES.includes(update));
        if (!isAllowedUpdate) {
            throw new Error("Invalid updates");
        }

        await User.findByIdAndUpdate({ _id: userId }, data, { runValidators: true });
    } catch (error) {
        console.error("Error in updating user", error);
        res.status(500).send("Internal Server Error");
    }
});

connectDB().then(() => {
    console.log('Database connected');

    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });

}).catch((err) => {
    console.error("Error in connecting database", err);
});
