const mongoose = require('mongoose');
const { Schema } = mongoose

const userSchema = new Schema({
    user_id: { type: Number },
    username: { type: String },
    password: { type: String },
    name: { type: String },
    lastname: { type: String },
    age: { type: Number },
    sex: { type: String },
    
}, {
    timestamps: true
})

module.exports = mongoose.model('user', userSchema);