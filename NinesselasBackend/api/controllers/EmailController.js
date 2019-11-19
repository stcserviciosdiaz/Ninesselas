/**
 * EmailController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: function (req, res) {
    const email = req.body
    sails.hooks.email.send(
      "sendEmail",
      {
        Name: email.name,
      },
      {
        to: email.to,
        subject: "Welcome Email"
      },
      function(err) {
        console.log(err || "Mail Sent!");
      }
    )
  }

};

