//Requiring all the necessary files and libraries
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const isAuthenticated = require('../middleware/auth');
const { sendConfirmationEmail } = require('../utils/emailTemp')
const { createTokens } = require('../utils/createtoken')

//Creating express router
const route = express.Router();
//Importing userModel
const userModel = require('../models/userModel');

//Creating register route
route.post("/register", async (req, res) => {

    try {
        const { name, email, password } = req.body;
        //Check emptyness of the incoming data
        if (!name || !email || !password) {
            return res.json({ message: 'Please enter all the details' })
        }

        //Check if the user already exist or not
        const userExist = await userModel.findOne({ email: req.body.email });
        if (userExist) {
            return res.json({ message: 'User already exist with the given emailId' })
        }
        //Hash the password
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashPassword;
        // saves the new user to the db
        const user = new userModel(req.body);
        await user.save();
        //generate token
        const userData = {username: user.username, id: user.id}
        const token = await createTokens(userData);
        //sending a mail to the client 
        sendConfirmationEmail(user.name , user.email, token);

        return res.cookie("token", token).json({ success: true, message: 'User registered successfully', data: user })
    } catch (error) {
        return res.json({ error: error });
    }
})

//Creating login routes
route.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        //Check emptyness of the incoming data
        if (!email || !password) {
            return res.json({ message: 'Please enter all the details' })
        }
        //Check if the user already exist or not
        const userExist = await userModel.findOne({ email: req.body.email });
        if (!userExist) {
            return res.json({ message: 'Wrong credentials' })
        }
        //Check password match
        const isPasswordMatched = await bcrypt.compare(password, userExist.password);
        if (!isPasswordMatched) {
            return res.json({ message: 'Wrong credentials pass' });
        }
        const token =  jwt.sign({ id: userExist._id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });
        
        return res.cookie("token",token).json({ success: true, message: 'LoggedIn Successfully', token: token })
    } catch (error) {
        return res.json({ error: error });
    }
})


//Creating user routes to fetch users data
route.get('/user', isAuthenticated, async (req, res) => {
    try {
        const user = await userModel.find();
        if (!user) {
            return res.json({ message: 'No user found' })
        }
        return res.json({ user: user })
    } catch (error) {
        return res.json({ error: error });
    }
})
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
  }

  //Create the Confirmation Route
route.get("/api/auth/confirm/:confirmationCode", controller.verifyUser)
exports.verifyUser = (req, res, next) => {
    User.findOne({
      confirmationCode: req.params.confirmationCode,
    })
      .then((user) => {
        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }
  
        user.status = "Active";
        user.save((err) => {
          if (err) {
            return res.status(500).send({ message: err });
          }
        });
      })
      .catch((e) => console.log("error", e));
  };
module.exports = route;