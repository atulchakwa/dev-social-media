//mongodb+srv://atulchakwa:<db_password>@cluster0.ytena.mongodb.net/
// Password == M9aDt4u3wgyNXCOj

const mongoose = require('mongoose');


const connectDB = async () =>{
 await mongoose.connect(
    "mongodb+srv://atulchakwa:M9aDt4u3wgyNXCOj@cluster0.ytena.mongodb.net/dev-social-media"
)
}

module.exports = connectDB;