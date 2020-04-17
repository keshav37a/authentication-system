const User = require('../models/user');
const ResetUser = require('../models/reset_user');
const cryptoObj = require('../config/crypto-js');
const moment = require('moment');
const resetPasswordMailer = require('../mailers/reset_password_mailer');


module.exports.home = async function(req, res){
    console.log('Inside home_controller.home');
    return res.render('home.ejs');
}

module.exports.signIn = async function(req, res){
    console.log('Inside home_controller.signIn');
    return res.render('sign-in.ejs');
}

module.exports.signUp = async function(req, res){
    console.log('Inside home_controller.signUp');
    return res.render('sign-up.ejs');
}

module.exports.createUser = async function (req, res) {
    console.log('Inside home_controller.createUser');
    console.log(req.body);

    //If password and confirm password fields dont match then return
    if (req.body.password != req.body.confirmPassword) {
        console.log("Passwords do not match");
        return res.redirect('back');
    }
    try {
        //If they do match then check if the user is already registered or not
        let user = await User.findOne({ email: req.body.email });

        //If user entry is not found on the db by email then add the user in the db
        if (!user) {

            let encrObj = cryptoObj.encrypt(req.body.password);
            // let decrObj = cryptoObj.decrypt(encrObj.toString());

            console.log('encrypt', encrObj);
            // console.log('decrypt', decrObj);

            req.body.password = encrObj.toString();
            let createdUser = await User.create(req.body);
            if (createdUser) {
                // req.flash('success', 'User created');
                return res.redirect('/users/signin');
            }
        }
        else {
            console.log('User already exists');
            // req.flash('error', 'User already exists');
            return res.redirect('back');
        }
    }
    catch (err) {
        // req.flash('error', err);
        console.log(`${err}`);
        return res.redirect('back');
    }
}

module.exports.createSession = async function(req, res){
    console.log(req.body);
    let email = req.body.email;
    let password = req.body.password;

    // console.log(`Entered details in login form: username: ${userName}  password: ${password}`);
    // To check if user is present in the db or not

    try{
        let user = await User.findOne({email:email});

        if(user){
            console.log('User found in create session');
            let decryptPassword = cryptoObj.decrypt(user.password);

            //If the password is correct then redirect to home page
            if(password===decryptPassword){
                console.log('Sign In Successful');
                res.cookie('user_id', user._id);
                console.log('cookies ', req.cookies);
                return res.render('home.ejs');
            }

            //Handle Incorrect password
            else{
                console.log('Incorrect Password');
                return res.redirect('back');
            }      
        }

        //Handle wrong username / new user trying to login
        else{
            console.log('Username/Email doesnt exist');
            return res.redirect('back');
        }

    }
    catch(err){
        console.log(`error: ${err}`);
    }
}

module.exports.destroySession = function(req, res){
    console.log('Inside home_controller.destroySession');
    console.log('in logout: ', req.cookies);
    delete req.cookies['user_id'];
    return res.redirect('/');
}

module.exports.forgotPassword = async function(req, res){
    console.log('Inside home_controller.forgotPassword');
    return res.render('forgot-password.ejs');
}

module.exports.forgotPasswordRequest = async function(req, res){
    console.log('Inside home_controller.forgotPasswordRequest');
    let email = req.body.email;
    try{
        let user = await User.findOne({email:email});
        if(user){
            let userId = user._id;
            console.log('user found in forgot password request');
            let randomString = Math.random().toString(36).substring(2, 15) + 
                               Math.random().toString(36).substring(2, 15);

            let resetUrl = `http://localhost:8000/reset-password/?token=${randomString}`;
            //Sending the new comment to the mailer
            resetPasswordMailer.resetPassword({user: user}, {link: resetUrl});

            console.log(resetUrl);

            let validity = moment.now();
            // console.log(validity);
            validity = validity + 600000;
            // console.log(validity);

            //First check if it already exists or not
            let resetUser = await ResetUser.findOne({user: userId});

            if(resetUser){
                console.log('resetUser found');
                resetUser.validity = validity;
                resetUser.token = randomString;
                (await resetUser).save();
            }
            else{
                console.log('new resetUser found');
                resetUser = await ResetUser.create({
                    user: user._id, 
                    token: randomString,
                    validity: validity      
                });
            }
            // console.log(resetUser);
            return res.redirect('/');
        }
        else{
            console.log('User not found');
            res.redirect('/');
        }
    }
    catch(err){
        console.log(`error: ${err}`);
    }
}

module.exports.resetPassword = async function(req, res){
    console.log('Inside home_controller.resetPassword');

    let stringToken = req.query.token;
    

    let resetUser = await ResetUser.findOne({token: stringToken}).populate('user');

    if(resetUser){
        console.log('user found in reset password');
        // console.log(resetUser);
        let currentTime = moment.now();
        let validity = resetUser.validity;
        let difference = validity-currentTime;

        console.log(currentTime);
        console.log(validity);
        console.log(difference);

        if(difference<=0){
            return res.send('<h1>Password reset window expired</h1>')
        }
        else{
            let userId = resetUser.user._id;
            console.log('checking:', userId);
            res.render('reset-password', {
                'title': 'title',
                'userId': userId.toString()
            });
        }
    }
    else{
        return res.send('<h1>Unauthorized</h1>');
    }
    
}

module.exports.resetPasswordRequest = async function(req, res){
    console.log('Inside home_controller.resetPasswordRequest');
    console.log('checking in final if it worked', req.body);

    let userId = req.body.userId;
    console.log('userId in resetPasswordRequest ', userId);

    let password = req.body.password;
    let repeatPassword = req.body.repeatPassword;
    if(password==repeatPassword){
        let user = await User.findById(userId);
        if(user){
            let encrObj = cryptoObj.encrypt(password);           
            user.password = encrObj.toString();
            await user.save();
            console.log('user password changed');
            return res.redirect('/');
        }
        else{
            return res.send('<h1>User Not Found</h1>')
        }
    }
    else{
        console.log('Passwords dont match');
        return res.redirect('/');
    }   
}