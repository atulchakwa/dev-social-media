const adminAuth = (req,res,next)=>{
    console.log("Admin auth is checked!!");
    const token = "xvz"
    const isAdminAuthrized = token === "xvz";
    if(isAdminAuthrized){
        next();
    }else{
        res.status(401).send("Unauthorized");
    }
    
}



const userAuth = (req,res,next)=>{
    console.log("Admin auth is checked!!");
    const token = "xvz"
    const isUserAuthrized = token === "xvz";
    if(isUserAuthrized){
        next();
    }else{
        res.status(401).send("Unauthorized");
    }
    
}

module.exports = {adminAuth,userAuth}