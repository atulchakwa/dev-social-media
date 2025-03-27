const express = require("express");
const profileRouter = express.Router();


const { userAuth } = require("../middleware/auth");

profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        console.log(user);
        
        res.send(user);
    } catch (err) {
        res.status(500).send("Error " + err.message);
        throw new Error(err);
    }
});

module.exports = profileRouter;