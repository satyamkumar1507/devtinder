const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation");

// profile api
profileRouter.get("/profile/view", userAuth, async (req,res) => {
    try{
      const user = req.user;

       res.send(user);
    } catch (err) {
        res.status(400).send("ERROR::"+ err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req,res) => {
    try{
      if(!validateEditProfileData(req)) {
        throw new Error("Invalid Edit Request");
      }

     const LoggedInuser = req.user;
     
     Object.keys(req.body).forEach((key) => (LoggedInuser[key] = req.body[key]));
      
     await LoggedInuser.save();

      res.json({
        message:`${LoggedInuser.firstName}, Your profile updated successfully`,
        data:LoggedInuser,    
    });

    } catch (err) {
        res.status(400).send("ERROR::"+ err.message);
    }
})

module.exports = profileRouter;