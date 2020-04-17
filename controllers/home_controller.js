module.exports.home = async function(req, res){
    console.log('Inside home_controller.home');
    return res.render('home.ejs');
}

