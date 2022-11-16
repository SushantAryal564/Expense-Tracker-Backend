const nodemailer = require("nodemailer");
const sendEmail = async (options) => {
  // 1) Create a transporter
  // 2) Define the email options
  // 3) Actually send the email
  const transporter = nodemailer.createTransport({
    service: "smtp-mail.outlook.com",
    secureConnection: false,
    port: 587,
    tls: {
      ciphers: "SSLv3",
    },
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailoptions = {
    from: process.env.EMAIL_SENDER,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailoptions);
};
module.exports = sendEmail;
