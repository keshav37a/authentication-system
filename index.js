const port = 8000;
const path = require('path');
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', function(req, res){
    res.render('home');
})

app.listen(port, function(err){
    if(err){console.log(`error in running app on local-host- ${err}`);}

    console.log(`app up and running on port ${port}`);
})