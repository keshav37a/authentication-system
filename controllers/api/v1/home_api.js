const User = require('../../../models/user');
const ResetUser = require('../../../models/reset_user');

module.exports.index = async function(req, res){
    console.log('home_api.index called');
    try{
        let users = await User.find({}).select(['-password']);
        return res.status(200).json({
            data:{
                users
            },
            message: 'Success'
        })
    }
    catch(err){
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
    
}

module.exports.signIn = function(req, res){
    
}

module.exports.signOut = function(req, res){
    
}