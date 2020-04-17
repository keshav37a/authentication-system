const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    token:{
        type: String,
    },
    Validity:{
        type: Date
    }
}, {
    timestamps : true
});


//creating and exporting our schema
const UserItem = mongoose.model('user-reset', userSchema);
module.exports = UserItem;