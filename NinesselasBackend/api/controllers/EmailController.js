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
        recipientEmail: email.from,
        recipientName: email.name,
        recipientPhone: email.phone,
        recipientText: email.text,
      },
      {
        to: email.to,
        subject: "Contacto Ninesselas"
      },
      function(err) {
        console.log(err || "Mail Sent!");
      }
    )
  },

};

