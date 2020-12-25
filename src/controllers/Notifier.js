const Settings = require("../settings");
// SendGrid
const sg = require("sendgrid")(Settings.SENDGRID_API_KEY);
const helper = require("sendgrid").mail;

module.exports = {
  notifyByEmail: function (destination, subject, message) {
    const sender = new helper.Email(Settings.sendgrid.sender);
    const recipient = new helper.Email(destination);
    const content = new helper.Content('text/html', message);
    const mail = new helper.Mail(sender, subject, recipient, content);

    const req = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
    });

    sg.API(req, function (err, res) {
      console.log(res.statusCode);
      console.log(res.body);
      console.log(res.headers);
      
    });
  }
};