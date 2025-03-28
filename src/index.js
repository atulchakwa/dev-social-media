const express = require('express');
const app = express();
const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");




app.use(express.json());
app.use(cookieParser());

const authRouter = require('./router/auth.js')
const profileRouter = require("./router/profile.js")
const requestRouter = require("./router/request.js");
const userRouter = require('./router/user.js');

app.use("/", authRouter);
app.use("/", requestRouter);
app.use("/", profileRouter);
app.use("/",userRouter)




connectDB().then(() => {
    console.log('Database connected');

    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });

}).catch((err) => {
    console.error("Error in connecting database", err);
});
