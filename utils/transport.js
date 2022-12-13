require("dotenv").config()

const nodemailer = require("nodemailer");

module.exports.transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.USEREMAIL,
        pass: process.env.PASSWORD,
        },
});
