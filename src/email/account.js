const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRIDE_API_KEY)

const sendwelcomemail = (email,name) => {

    sgMail.send({
        to : email,
        from : 'info@jhwebtech.com',
        subject : 'Thanks for Joining in !',
        text : `Welcome to app, ${name}, let me know how you along with app`
    })
}

const sendbymail = (email,name) => {
    sgMail.send({
        to : email,
        from : 'info@jhwebtech.com',
        subject : 'Your Account Deleted Successfully !',
        text : `Thank Your For choosing Our service, ${name}, if you want you can comeback in future`
    })
}
module.exports = {
    sendwelcomemail,
    sendbymail

}