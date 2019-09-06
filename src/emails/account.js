const sgMail = require('@sendgrid/mail');
const sendgridAPIKey = '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';

sgMail.setApiKey(sendgridAPIKey);

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

