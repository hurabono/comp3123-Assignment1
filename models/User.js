const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    email: { 
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: { 
        type: String,
        required: true
    },
    created_at: { 
        type: Date, 
        default: Date.now 
    },
    updated_at: { 
        type: Date, 
        default: Date.now 
    }
});





const User = mongoose.model('User', userSchema);
module.exports = User;