const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')

function send (toMail, subject, message) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport(smtpTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: 'nopeopleihc@gmail.com',
        pass: '123qweasd$'
      }
    }))
    const mailOptions = {
      from: 'admin@inc.com',
      to: toMail,
      subject: subject,
      text: message
    }
     
    transporter.sendMail(mailOptions, function(error, info){
      if (error) return reject(error)
      resolve()
    })
  })
}
module.exports = {
  send
}