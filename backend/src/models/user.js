const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid email Address"+ value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error("Enter Strong Password"+ value);
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male","female","others"].includes(value)) {
                throw new Error("sender data is not valid");
            }
        },
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    membershipType: {
      type: String,
    },
    photoUrl: {
        type: String,
        validate(value) {
            if(validator.isURL(value)) {
                throw new Error("Invalid URL Address"+ value);
            }
        }
    },
    about : {
        type: String,
        default : "This is the default value for the user"
    },
    skills: {
        type: [String],
    },
},
{
    timestamps: true,
}
);


userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({_id:user._id},process.env.JWT_SECRET,{
        expiresIn: "7d",
    });

    return token;
};


module.exports = mongoose.model("User",userSchema)