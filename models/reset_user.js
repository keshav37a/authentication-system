const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    token:{
        type: String,
        required: true
    },
    validity:{
        type: Number,
        required: true
    }
}, {
    timestamps : true
});


//creating and exporting our schema
const UserItem = mongoose.model('user-reset', userSchema);
module.exports = UserItem;