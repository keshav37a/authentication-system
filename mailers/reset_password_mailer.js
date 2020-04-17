const nodeMailer = require('../config/nodemailer');

//exporting the reset password function
exports.resetPassword = (user, link)=>{
    
    console.log('Reset password mailer called');
    console.log(user);
    console.log(user.user.email);
    console.log(link);
    //We have already defined the previous part of the path in nodemailer.js
    let htmlString = nodeMailer.renderedTemplate({name: user.user.name, link:link.link}, 'passwords/reset-password.ejs');
    console.log(htmlString);
    nodeMailer.transporter.sendMail({
        from : 'keshav37a@gmail.com',
        to : user.user.email,
        subject : 'Password Reset',
        html: htmlString
    }, (err, info) => {
        if(err){console.log('error in sending mail', err); return;}
        
        console.log('Message sent', info);
        return;
    });
}

