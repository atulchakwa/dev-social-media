const express = require('express');

const userRouter = express.Router()
const {userAuth} = require("../middleware/auth")
const ConnectionRequest = require("../model/connectionRequest")
userRouter.get("/user/request/received",userAuth, async (req , res)=>{

    try {
        
        const loggedInUser = req.user;
         const connectionRequest = await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
         }).populate("fromUserId",["firstName", "lastName","skills","about"])

         res.json({
            msg:"Data fetch successfully",
            data:connectionRequest
         })
    } catch (error) {
        res.status(404).send("Error "+error.message);
    }
})


userRouter.get("/user/connection",userAuth, async (req,res)=>{
    try {
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser,status:"accepted"},
                {toUserId:loggedInUser,status:"accepted"}
            ],
        }).populate("fromUserId",["firstName","lastName"]);

        const data = connectionRequest.map((row)=> row.fromUserId)
        res.json({data})
    } catch (error) {
        res.status(404).send({msg:error.message})
    }
})

module.exports = userRouter;