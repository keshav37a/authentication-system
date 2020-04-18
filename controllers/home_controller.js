const User = require('../models/user');
const ResetUser = require('../models/reset_user');
const cryptoObj = require('../config/crypto-js');
const moment = require('moment');
const resetPasswordMailer = require('../mailers/reset_password_mailer');
const verifyEmailMailer = require('../mailers/verify_email_mailer');

module.exports.home = async function(req, res){
    console.log('Inside home_controller.home');
    return res.render('home.ejs');
}

//Rendering the signin page
module.exports.signIn = async function(req, res){
    console.log('Inside home_controller.signIn');
    return res.render('sign-in.ejs');
}

//Rendering the signup page
module.exports.signUp = async function(req, res){
    console.log('Inside home_controller.signUp');
    return res.render('sign-up.ejs');
}

//To create new user after submitting the signup form
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

            //encrypting the password using AES
            let encrObj = cryptoObj.encrypt(req.body.password);

            let token = Math.random().toString(36).substring(2, 15) + 
                               Math.random().toString(36).substring(2, 15);

            let verifyUrl = `http://localhost:8000/verify/?token=${token}`;

            //Passing the user and email verification link to the mailer
            verifyEmailMailer.verifyEmail({user: req.body}, {link:verifyUrl});

            req.body.isVerified = false;
            req.body.signUpToken = token;
            req.body.password = encrObj.toString();

            let createdUser = await User.create(req.body);
            if (createdUser) {
                return res.redirect('/sign-in');
            }
        }
        else {
            console.log('User already exists');
            return res.redirect('back');
        }
    }
    catch (err) {
        console.log(`${err}`);
        return res.redirect('back');
    }
}

//To verify a user by sending a verification link to his/her email
module.exports.verifyEmail = async function(req, res){
    console.log('Inside home_controller.verifyEmail');
    console.log(req.query);
    try{
        //If the signup token matches with the query then user is verifies
        let user = await User.findOne({signUpToken: req.query.token});
        if(user){
            user.isVerified = true;
            console.log('User Verified');
            await user.save();
            return res.redirect('/');
        }
        else{
            return res.send('<h1>Invalid Token</h1>');
        }
    }
    catch(err){
        console.log(err);
    }
}

//After getting verified using passport-local library create session is called
module.exports.createSession = async function(req, res){
    console.log('Inside home_controller.createSession');
    console.log(req.user);
    return res.redirect('/');
}

//Sign-out
module.exports.destroySession = function(req, res){
    console.log('Inside home_controller.destroySession');
    req.logout();
    console.log(req.user);
    return res.redirect('/');
}

//Rendering the forgot password page 
module.exports.forgotPassword = async function(req, res){
    console.log('Inside home_controller.forgotPassword');
    return res.render('forgot-password.ejs');
}

//Called when submitting the email form in the forgot password page
module.exports.forgotPasswordRequest = async function(req, res){
    console.log('Inside home_controller.forgotPasswordRequest');
    let email = req.body.email;
    try{

        //If the email of that particular user is found in db 
        let user = await User.findOne({email:email});
        if(user){
            let userId = user._id;
            console.log('user found in forgot password request');
            let randomString = Math.random().toString(36).substring(2, 15) + 
                               Math.random().toString(36).substring(2, 15);

            let resetUrl = `http://localhost:8000/reset-password/?token=${randomString}`;

            //Sending the reset password link to the mailer
            resetPasswordMailer.resetPassword({user: user}, {link: resetUrl});
            let validity = moment.now();

            //Adding a validity of 10 minutes to this token
            validity = validity + 600000;

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

//After token verification Reset password page containing the form which would change the password of the user
module.exports.resetPassword = async function(req, res){
    console.log('Inside home_controller.resetPassword');

    let stringToken = req.query.token;
    let resetUser = await ResetUser.findOne({token: stringToken}).populate('user');

    if(resetUser){
        console.log('user found in reset password');
        let currentTime = moment.now();
        let validity = resetUser.validity;
        let difference = validity-currentTime;

        console.log(currentTime);
        console.log(validity);
        console.log(difference);

        //If the currentTime exceeds the validity period then we dont render the form
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
    //If no user is found by that token
    else{
        return res.send('<h1>Unauthorized</h1>');
    }
    
}

//After submitting the new password form
module.exports.resetPasswordRequest = async function(req, res){
    console.log('Inside home_controller.resetPasswordRequest');

    let userId = req.body.userId;
    let password = req.body.password;
    let repeatPassword = req.body.repeatPassword;

    //If passwords are equal
    if(password==repeatPassword){
        let user = await User.findById(userId);
        if(user){
            //Encrypt the new password and save it in the user's current password
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

