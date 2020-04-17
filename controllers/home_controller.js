const User = require('../models/user');
const cryptoObj = require('../config/crypto-js');


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

    let encrObj = cryptoObj.encrypt(req.body.password);
    // let decrObj = cryptoObj.decrypt(encrObj.toString());

    console.log('encrypt', encrObj);
    // console.log('decrypt', decrObj);

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
            console.log('User found');
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
