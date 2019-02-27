const nodemailer = require('nodemailer');
const gmailAccount = require('../configuration/gmailAccount');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: gmailAccount.user,
    clientId: gmailAccount.clientId,
    clientSecret: gmailAccount.clientSecret,
    refreshToken: gmailAccount.refreshToken,
    accessToken: gmailAccount.refreshToken
  },
});

module.exports = {
  send: function (req, res) {
    let {
      name,
      email,
      subject,
      text
    } = req.body;
    res.send({
      key: "value"
    })

    let message = {
      from: "knecht.hans@gmail.com",
      to: "knecht.silvan@gmail.com",
      subject,
      text: `Name: ${name}, Email: ${email} | ${text}`,
      html: `${text}<br><hr><p>Name: ${name}, Email ${email}</p>`
    };


    transporter.sendMail(message, (err, res) => {
      if (err) {
        console.log('Email NOT sent!', err);
      } else {}
    })

  }
}