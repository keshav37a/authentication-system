const nodeMailer = require('../config/nodemailer');

//exporting the reset password function
exports.verifyEmail = (user, link)=>{    
    console.log('Verify Email mailer called');
    //We have already defined the previous part of the path in nodemailer.js
    let htmlString = nodeMailer.renderedTemplate({name: user.user.name, link:link.link}, 'emails/verify-email.ejs');
    nodeMailer.transporter.sendMail({
        from : 'keshav37a@gmail.com',
        to : user.user.email,
        subject : 'Verify Email',
        html: htmlString
    }, (err, info) => {
        if(err){console.log('error in sending mail', err); return;}
        
        console.log('Message sent', info);
        return;
    });
}

