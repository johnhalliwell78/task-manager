const sgMail = require('@sendgrid/mail');
// const sendgridAPIKey = '';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    const msg = {
        to: email,
        from: 'tranhoanggiang0708@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app`
    };
    sgMail.send(msg);
};

module.exports = {
    sendWelcomeEmail
};

