const port = 8000;
const express = require('express');

const app = express();
app.listen(port, function(err){
    if(err){console.log(`error in running app on local-host- ${err}`);}

    console.log(`app up and running on port ${port}`);
})