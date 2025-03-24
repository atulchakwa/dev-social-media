const express = require('express');
const app = express();
const connectDB = require("./config/database.js")
const User = require("./model/user.model.js")



app.use(express.json());

app.post("/signup", async (req, res) => {
    try {
      const user = new User(req.body);
      console.log(req.body);
      await user.save();
      res.send("User successfully registered");
    } catch (error) {
      console.error("Error in user registration", error);
      // Check for duplicate key error (code 11000)
      if (error.code === 11000) {
        return res.status(400).send("Email already exists");
      }
      res.status(500).send("Internal Server Error");
    }
  });
  



app.get("/users",async (req , res)=>{ 
    const useremail = req.body.email;   
    try {
        const users = await User.find({email:useremail});
       
        if(users.length === 0){
            return res.status(404).send("User not found");
        }
        else{
            res.send(users);
        }
    } catch (error) {
        console.error("Error in getting users", error);
        res.status(500).send("Internal Server Error");
    }
    console.log(useremail);
    
}
)



app.get("/feed", async (req , res)=>{
    try{
           const users = await User.find({});
           res.send(users);
    }
    catch(error){
        console.error("Error in getting feed", error);
        res.status(500).send("Internal Server Error");
    }
})


app.patch("/users/:userId", async (req,res) =>{
    const userId = req.params?.userId;
    const data = req.body;
    try{
        const ALLOWED_UPDATES = [
            "gender",
            "age",
        ]
        
        const isAllowedUpdate = Object.keys(data).every(update=> ALLOWED_UPDATES.includes(update));
        if(!isAllowedUpdate){
            throw new Error("Invalid updates");
        }
        
       const user = await User.findByIdAndUpdate({_id : userId},data,{runValidators:true});
    }
    catch(error){
        console.error("Error in updating user", error);
        res.status(500).send("Internal Server Error");
    }
})



connectDB().then(()=>{
    console.log('Database connected');
    
    app.listen(3000,()=>{
        console.log('Server is running on port 3000');
    })

}).catch((err)=>{
    console.error("Error in connecting database",err);
    
})


   

