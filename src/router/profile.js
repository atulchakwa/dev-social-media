const express = require("express");
const profileRouter = express.Router();

const {validateEditProfileData} = require("../utils/validator")
const { userAuth } = require("../middleware/auth");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        console.log(user);
        
        res.send(user);
    } catch (err) {
        res.status(500).send("Error " + err.message);
        throw new Error(err);
    }
});

profileRouter.patch("/profile/edit",userAuth,async (req,res)=>{
   try {if(!validateEditProfileData(req)){
        throw new Error("Invalid fields to edit")
    }

    const loggedInuser = req.user;
   Object.keys(req.body).forEach((key)=>(loggedInuser[key] = req.body[key]))
   await loggedInuser.save();

   res.json({
     message: `${loggedInuser.firstName}, your profile updated successfully`,
     data: loggedInuser,
   });
    console.log(loggedInuser);
   
    
}
catch(err)
{
    res.status(400).send("Error "+ err.message)
}
})

module.exports = profileRouter;