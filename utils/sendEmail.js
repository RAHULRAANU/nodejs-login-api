const nodemailer = require('nodemailer');

const sendEmail = async options => {
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });


// var transport = nodemailer.createTransport({
//   host: "sandbox.smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: "17b7ae79ff63cd",
//     pass: "d6a8c84b2435b4"
//   }
// });


const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  const info = await transport.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;


