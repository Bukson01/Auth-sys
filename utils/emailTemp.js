require("dotenv").config()
const { transport } = require('../utils/transport')

// dont forget to work on the link yoiu will be using.

module.exports.sendConfirmationEmail = (name, email, confirmationCode) => {
    console.log("Check");
    transport.sendMail({
        from: user,
        to: email,
        subject: "Please confirm your account",
        html: `<h1>Email Confirmation</h1>
            <h2>Hello ${name}</h2>
            <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
            <a href=http://localhost:5000/confirm/${confirmationCode}> Click here</a>
            </div>`,
    }).catch(err => console.log(err));
};