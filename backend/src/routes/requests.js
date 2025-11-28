const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const sendEmail = require("../utils/sendEmail");

// sendingRequest api
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req,res) => {
    
    try{
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      console.log("gandu",fromUserId,toUserId,status);
      
      const allowedStatus = ["ignored","interested"];
      if(!allowedStatus.includes(status)) {
        return res.status(400).json({message: "Invalid status type:" + status});
      }

      // check toUserId is available in database or not
      const toUser = await User.findById(toUserId);
      if(!toUser) {
        return res.status(400).json({
            message: "User not found!!",
        });
      }

      // If there is an existing connectionRequest
      const exixtingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
            {fromUserId, toUserId},
            {fromUserId: toUserId, toUserId: fromUserId},
        ],
      });
      if(exixtingConnectionRequest) {
      console.log("i am user ");

        return res.status(400).send({message: "Connection Request Already Exists"});

      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      // const emailRes = await sendEmail.run();
      // console.log(emailRes);
console.log("i am user ");

      res.json({
        message: "connection request sent successfully!",
        data,
      });

    } catch (err) {
        res.status(400).send("ERROR::"+ err.message);
    }
});


// reviewRequest api
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req,res) => {
   
  try{
     const loggedInUser = req.user;
     const {status, requestId} = req.params;

     const allowedStatus = ["accepted","rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({message: "Status not found!"});
      }
     
      const connectionRequest = await ConnectionRequest.findOne({
        _id:requestId,
        toUserId: loggedInUser._id,
        status:"interested",
      });
      if(!connectionRequest) {
        return res.status(404).json({message: "connection request not found!"});
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({message : "connection request:"+ status,data});

  } catch (err) {
    res.status(400),send("ERROR::" + err.message);
  }
})

module.exports = requestRouter;