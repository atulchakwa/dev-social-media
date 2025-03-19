const express = require('express');
const app = express();

const {adminAuth,userAuth} = require('./middleware/auth');
//const {userAuth} = require('./middleware/auth');
app.use("/admin",adminAuth);


app.get("/user",userAuth,(req,res)=>{
    res.send("All data user sent")
   })

app.get("/admin/getAlldat",(req,res)=>{
 res.send("All data sent")
})

app.get("/admin/delete",(req,res)=>{
    res.send("All data Delete")
   })
   

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})