const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth.js");
const ConnectionRequest = require("../model/connectionRequest.js")
const User = require("../model/user.model.js")


requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const allowedStatus = ["ignored","interested"];
        if(!allowedStatus.includes(status))
        {
            return res.status(400).json({msg:"Invalid Status type" + status})
        }

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(400).json({msg:"User not found"})
        }

        const connectionRequest = new ConnectionRequest ({
            fromUserId,
            toUserId,
            status
        });
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if(existingConnectionRequest)
            {
                return res.status(400).send({msg:"Connecton Request already exist"})
            }
        const data = await connectionRequest.save();
        console.log(data);
        
        res.json({msg:req.user.firstName + " is "+ status + " in " +toUser.firstName})
        // console.log(req.user.firstName);
        
    } catch (err) {
        res.status(500).send("Error " + err.message);
    }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const allowedStatus = ["accepted","rejected"]
        const {status} = req.params;
        const {requestId} = req.params;
        if(!allowedStatus.includes(status)){
            return res.status(404).send({msg:"Invalid status type"});
        }
       
        const connectionRequest = await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"interested"
        })

        if(!connectionRequest){
            return res.status(404).send({msg:"connection request not found"})
        }
        
        connectionRequest.status = status;

        const data = await connectionRequest.save();
        res.json({msg:"connection request" + status,data})
    } catch (error) {
        res.status(500).send("Error " + error.message);
    }
})

module.exports = requestRouter;
