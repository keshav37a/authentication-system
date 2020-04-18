const User = require('../../../models/user');
const ResetUser = require('../../../models/reset_user');
const jwt = require('jsonwebtoken');
const cryptoObj = require('../../../config/crypto-js');

//Retrieving the list of all users
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

//Sign in a particular user using jwt
module.exports.signIn = async function(req, res){
    try{
        let user = await User.findOne({email: req.body.email});

        let decryptedPassword = cryptoObj.decrypt(user.password);
        if(!user || decryptedPassword != req.body.password){
            return res.json(422, {
                message: 'Invalid usernam/password'
            })
        }
        else{
            return res.json(200, {
                message: 'Sign in successful. Here is your token. Please keep it safe',
                data: {
                    token: jwt.sign(user.toJSON(), 'codeial', {expiresIn: 100000})
                }
            })
        }

    }
    catch(err){
        console.log(`error: ${err}`);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

