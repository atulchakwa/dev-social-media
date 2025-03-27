const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth.js");

requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
    try {
        const user = req.user;
        res.send(user.firstName + " Sending a connection request");
    } catch (err) {
        res.status(500).send("Error " + err.message);
    }
});

module.exports = requestRouter;
