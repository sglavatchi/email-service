'use strict';

const MAILGUN_APIKEY = process.env.MAILGUN_APIKEY
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN

const mailgun = require('mailgun-js')({
  apiKey: MAILGUN_APIKEY,
  domain: MAILGUN_DOMAIN
});

const fromAddress = `<demo@sandbox3cba6cc98ef94e6a9b96a668df752e48.mailgun.org>`;
const subjectText = "Serverless Email Demo";
const messageText = 'Sample email sent from Serverless Email Demo.';
const messageHtml = `
<html>
  <title>Serverless Email Demo</title>
  <body>
    <div>
      <h1>Serverless Email Demo</h1>
      <span>Sample email sent from Serverless Email Demo.</span>
    </div>
  </body>
</html>
`

module.exports.sendEmail = (event, context, callback) => {

  var toAddress = "";

  if (event.body) {
    try {
      toAddress = JSON.parse(event.body).to_address || "";
    }
    catch (e) {
    }
  }

  if (toAddress !== "") {

    const emailData = {
      from: fromAddress,
      to: toAddress,
      subject: subjectText,
      text: messageText,
      html: messageHtml
    };

    mailgun.messages().send(emailData, (error, body) => {
      if (error) {
        console.log(error);
        callback(error);
      } else {
        const response = {
          statusCode: 202,
          body: JSON.stringify({
            message: "Request to send email is successful.",
            input: body
          })
        };
        console.log(response);
        callback(null, response);
      }

    });

  }

  else {
    const err = {
      statusCode: 422,
      body: JSON.stringify(
        {
          message: "Bad input data or missing email address.",
          input: event.body
        }
      )
    };

    console.log(err);
    callback(null, err);
  }
};
