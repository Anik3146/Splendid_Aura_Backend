require("dotenv").config();
const nodemailer = require("nodemailer");
const { secret } = require("./secret");

// sendEmail
module.exports.sendEmail = (body, res, message) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Correct SMTP host
    port: 465, // Use 465 for secure connections
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS, // Your App Password
    },
  });

  transporter.verify(function (err, success) {
    if (err) {
      res.status(403).send({
        message: `Error happen when verify ${err.message}`,
      });
      console.log(err.message);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  transporter.sendMail(body, (err, data) => {
    if (err) {
      res.status(403).send({
        message: `Error happen when sending email ${err.message}`,
      });
    } else {
      res.send({
        message: message,
      });
    }
  });
};
