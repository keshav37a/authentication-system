const port = 8000;
const path = require('path');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('./config/mongoose');

//To parse form body
app.use(express.urlencoded());

app.use(cookieParser());

//Setting up view engine and views property
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// To use static files in our app
app.use(express.static('./assets'));

//Setting up routes
app.use('/', require('./routes/index'));

app.listen(port, function(err){
    if(err){console.log(`error in running app on local-host- ${err}`);}

    console.log(`app up and running on port ${port}`);
})