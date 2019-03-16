const User = require('./User')

const getRandPass = (length) =>
{
    const alphabet = 'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789'.split()
    let pass = ''
    for (let i = 0; i < length || alphabet.length < 1; i++)
    {
        const n = Math.round(alphabet.length - 1 * Math.random())
        pass += alphabet.splice(n, 1)[0]
    }

    return pass
}

module.exports = class UserManager
{
    constructor()
    {
        
    }
}
