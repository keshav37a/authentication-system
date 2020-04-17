const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const cryptoObj = require('../config/crypto-js');

console.log('passport local strategy loaded');

//authentication using passport
passport.use(new LocalStrategy({
    usernameField:'email',
    passReqToCallback: true},
    async function(req, email, password, done){
        console.log('inside passport.use');

        //find a user and establish an identity
        let user = await User.findOne({email:email});

        if(user){
            console.log('User found in passport-local-strategy');
            if(user.isVerified!=true){
                console.log('User not verified');
                // req.flash('error', 'You need to verify your email first');
                return done(null, false);
            }
            else{
                let passwordFromDB = user.password;
                let decryptedPassword = cryptoObj.decrypt(passwordFromDB);
                if(decryptedPassword != password)
                {
                    console.log('Incorrect Password');
                    // req.flash('error', 'Incorrect username/password');
                    return done(null, false);
                }
                else{
                    // req.flash('success', 'Successfully Logged In');
                    console.log('Successful --- Passport.js');
                    return done(null, user);
                }
            }
        }
        else{
            console.log('User not found');
            // req.flash('error', 'Incorrect username/password');
            return done(null, false);
        }
    }
));

//Serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    console.log('serialize called');
    done(null, user.id);
});

//Deserialize the user from the key in the cookies
passport.deserializeUser(function(id, done){
    console.log('deserialize called');
    User.findById(id, function(err, user){
        if(err){
            console.log('Error finding user in db while deserializing --- Passport.js');
            return done(err);
        }
        return done(null, user);
    });
});

//Middleware to check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
    //If the user is authenticated pass on the request to the next function(controller's action)
    if(req.isAuthenticated()){
        console.log('checkAuthentication - authenticated');
        return next();
    }

    //If the user is not signed in
    console.log('checkAuthentication - Not Authenticated');
    return res.redirect('/users/signin');
}

//
passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        //req.user contains the current signed in user from the session cookie and we re just sending this to the locals for the views
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;