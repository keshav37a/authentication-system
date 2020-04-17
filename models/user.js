const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    name:{
        type:String,
        required: true
    },
    avatar:{
        type:String,
    },
}, {
    timestamps : true
});


//creating and exporting our schema
const UserItem = mongoose.model('user', userSchema);
module.exports = UserItem;