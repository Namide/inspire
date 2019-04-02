
const Email = require('email-templates')


const sendEmail = (from, to, subject, body) =>
{
    // no-reply@

    const email = new Email({
        message: {
          from: 'no-reply@hello.com'
        },
        transport: {
          jsonTransport: true
        },
        textOnly: true // no HTML
      })
      
    return email
        .render(view, locals)
        .send({
            template: 'mars',
            message: {
                to: 'damien@doussaud.fr'
            },
            locals: {
                name: 'Damien'
            }
        })
        .then(console.log)
        .catch(console.error)
}

module.exports = {
    sendEmail
}