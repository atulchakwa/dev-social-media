const express = require('express');

const userRouter = express.Router()
const {userAuth} = require("../middleware/auth")
const ConnectionRequest = require("../model/connectionRequest");
const User = require("../model/user.model")
const { set } = require('mongoose');
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

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page-1)*limit;
        const loggedInUser = req.user;
        
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ],
        }).select("fromUserId toUserId");

        const hideUSerFromFeed = new Set();

        connectionRequest.forEach((request) => {
            hideUSerFromFeed.add(request.toUserId.toString());
            hideUSerFromFeed.add(request.fromUserId.toString());
        });

        // Include the logged-in user as well
        hideUSerFromFeed.add(loggedInUser._id.toString());

        const users = await User.find({
          $and:[ { _id: { $nin: Array.from(hideUSerFromFeed) }},
            {id:{$ne:loggedInUser._id}}
          ],
        }).select("firstName","lastName").skip(skip).limit(limit)

        res.status(200).json(users);  // Send the result as JSON response
    } catch (error) {
        res.status(404).send("Error: " + error.message);
    }
});


module.exports = userRouter;