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
