const port = 8000;
const path = require('path');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const db = require('./config/mongoose');

//passport
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const session = require('express-session');

const MongoStore = require('connect-mongo')(session);

//For setting up flash messages
const flash = require('connect-flash');
const customMiddleware = require('./config/middleware');

//To parse form body
app.use(express.urlencoded());

app.use(cookieParser());

// To use static files in our app
app.use(express.static('./assets'));

//Setting up view engine and views property
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    name: 'authentication-system',
    //TODO- change the secret before deployment in production mode
    secret: 'its-over-9000',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000*60*100)
    },
    store: new MongoStore({
        mongooseConnection:db,
        autoRemove: 'disabled'
    },
    function(err){
        console.log(err || 'connect-mongodb session cookie db storage successfully setup');
    })
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

//Setting up routes
app.use('/', require('./routes/index'));

app.use(flash());
app.use(customMiddleware.setFlash);

app.listen(port, function(err){
    if(err){console.log(`error in running app on local-host- ${err}`);}

    console.log(`app up and running on port ${port}`);
})