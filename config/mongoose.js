const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/authentication_system');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'error connecting to mongodb'));

db.once('open', function(err){
    console.log('successfully connected to db');
})

module.exports = db;

