const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { 
        type: String, 
        required: true,
        unique: true,
        match: /^\S+@\S+\.\S+$/
    },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { 
        type: Number, 
        required: true,
        min: 18
    },
    country: { type: String },
    city: { type: String }
});

module.exports = mongoose.model('User', userSchema);