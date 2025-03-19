const express = require('express');
const app = express();
const connectDB = require("./config/database.js")
const User = require("./model/user.model.js")



app.use(express.json());

app.post("/signup",async (req , res)=>{
    const user = new User(req.body);
    console.log(req.body);
    
    await   user.save();
    res.send("User successfully registered")
})
connectDB().then(()=>{
    console.log('Database connected');
    
    app.listen(3000,()=>{
        console.log('Server is running on port 3000');
    })

}).catch((err)=>{
    console.error("Error in connecting database",err);
    
})


   

