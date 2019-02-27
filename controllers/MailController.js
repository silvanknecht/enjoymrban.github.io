const nodemailer = require('nodemailer');
const gmailAccount = require('../configuration/gmailAccount');
const {
  secret
} = require('../configuration/recaptcha')
const fetch = require('node-fetch');

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
  send: async function (req, res) {
    console.log(req.body);
    let {
      contactName,
      contactEmail,
      contactMessage,
      token
    } = req.body;

    let message = {
      from: "knecht.hans@gmail.com",
      to: "knecht.silvan@gmail.com",
      subject: "KONAKTFORMULAR : silvanknecht.ch",
      text: `Name: ${contactName}, Email: ${contactEmail} | ${contactMessage}`,
      html: `${contactMessage}<br><hr><p>Name: ${contactName}, Email: ${contactEmail}</p>`
    };


    fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`, {
        method: 'post',
      })
      .then(resGoogleAPI => {
        return resGoogleAPI.json();
      }).then(body => {
        console.log(body);
        if (body.success !== undefined && !body.success) {
          return res.json({
            "responseError": "Failed captcha verification"
          });
        } else {
          res.json({
            "responseSuccess": "Sucess"
          });

          transporter.sendMail(message, (err, res) => {
            if (err) {
              console.log('Email NOT sent!', err);
            } else {
              res.status(200);
            }
          });
        }

      })
      .catch((err) => {
        console.log(err)
      });

  }
}