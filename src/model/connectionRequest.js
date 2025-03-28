const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({

    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum: {
            values:["ignores","rejected","accepted","interested"],
            message: `{VALUE} is an incorrect status type`
        }
    }
} ,{timestamps:true})

connectionRequestSchema.pre("save",function(next){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId))
    {
    //    return res.status(400).send({msg:"You can't send request to yourself"})
    throw new Error("You can't send request to yourself")

    }
    next();
})

  connectionRequestSchema.index({fromUserId:1,toUserId:1}) 

const ConnectionRequestModel = new mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports = ConnectionRequestModel;