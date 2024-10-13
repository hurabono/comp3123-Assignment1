/*
    /api/v1/user/signup
    - POST 201 Allow user to create new account
    /api/v1/user/login
    - POST 200 Allow user to access the system
*/


const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const routes = express.Router();
const mongoose = require("mongoose");


// Mongoose connect 
const DB_CONNECTION_STRING = "mongodb+srv://stephfee:y69kjrSYJi5BdBs6@productdb.mmelk.mongodb.net/?retryWrites=true&w=majority&appName=productdb"; ;

mongoose.connect( DB_CONNECTION_STRING,{ // connect is the calling promise
    useNewUrlParser: true,
    useUnifiedTopology: true

}).then(() => {
    console.log("MongoDB for user! connected well!!");

}).catch(err => {
    console.error("MongoDB connection error:", err);

});


routes.post('/signup', async(req, res) => {
    const { username, email, password } = req.body;
    console.log({ username, email, password });

    try {

        // make hashed password
        const hashedPw = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPw });

        // save the user to MongoDB
        const newUser = await user.save();
        
        // save session ID in mongoDB
        req.session.userId = newUser._id;

        res.status(201).send({ message: 'User created successfully', user: newUser });

        return res.redirect('/api/v1/emp/employees');


    } catch(err) {
        res.status(500).send({ message: err.message });
    }

    
});




// login post
routes.post('/login', async (req, res) => {

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.send({ message: 'Invalid Email, try again' });
        }

        const isPw = await bcrypt.compare(password, user.password);
        if (!isPw) {
            return res.send({ message: 'Invalid password, try again' }); 
        }

        req.session.userId = user._id;
        return res.redirect('/api/v1/emp/employees'); 


    } catch (err) {

        return res.status(500).send({ message: err.message });
        
    }


});





module.exports = routes;

