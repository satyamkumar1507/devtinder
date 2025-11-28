const express = require("express");
const {validateSignUpdata} = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const authRouter = express.Router();

// signup api
authRouter.post("/signup", async (req,res) => {
    try{
    // validation of data
    validateSignUpdata(req);
   
    const { firstName, lastName, emailId, password } = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

     // creating a new instance of the User model
     const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
     });
     
     await user.save();
     res.send("user added successfully");
     }catch(err) {
      res.status(400).send("ERROR::" + err.message);
     }
}) 

// login api
authRouter.post("/login", async (req,res) => {

    try{
       const {emailId,password} = req.body;

       const user = await User.findOne({emailId: emailId});

       if(!user) {
        throw new Error("Invalid credentials");
       }

       const isPasswordValid = await bcrypt.compare(password, user.password);

       if(isPasswordValid) {

       // create a JWT Token
       const token = await user.getJWT();
       
         console.log(token);

       // Add the token to cookie and send the response back to the user
       res.cookie("token", token, {expires: new Date(Date.now() + 8 * 3600000),});
        res.send("Login successfull ");
       }else{
        throw new Error("password is not correct");
       }
    }catch (err) {
        res.status(400).send("ERROR::"+ err.message);
    }
});

// Logout api
authRouter.post("/logout", async (req,res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("Logout successfull");
})

module.exports = authRouter;