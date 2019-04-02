const User = require('./User')

const COLLECTION_NAME = 'user'

const getRandPass = length =>
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

/*
name
hash
mail
role

token
expire
*/

const USER_ROLE = {
    GUEST: 1,
    SUBSCRIBER: 2,
    AUTHOR: 3,
    EDITOR: 4,
    ADMIN: 5
}

const checkUser = data =>
{
    for (const key in data)
    {
        const value = data[key]
        switch (key)
        {
            case 'name' :
                if (typeof value !== typeof '')
                    return 'Name must be a string'
                if (value.length > 64)
                    return 'Name can not exceed 128 characters'
                break
            case 'mail' :
                if (typeof value !== typeof '')
                    return 'E-mail must be a string'
                if (value.length > 128)
                    return 'E-mail can not exceed 1024 characters'
                break
            case 'pass' :
                if (typeof value !== typeof '')
                    return 'Password must be a string'
                if (value.length < 4)
                    return 'Password can not be inferior to 4 characters'
                if (value.length > 64)
                    return 'Password can not exceed 64 characters'
                
                break
            case 'role' :

                const roles = Object.values(USER_ROLE)
                const min = Math.min(...roles)
                const max = Math.max(...roles)

                if (typeof value !== typeof 2 && Number.isInteger(value))
                    return 'Role must be an integer'
                if (value < min || value > max)
                    return 'Role must be between ' + min + ' and ' + max
                break
            default :
                return 'The property "' + key + '" can not be add to user'
        }
    }

    return true
}


module.exports = class UserManager
{
    constructor(database)
    {
        this.database = database
    }

    getConnectedUser(data)
    {
        // require('bcrypt').compare(pass, hash) // Promise
    }

    inputUser(data, connectedUser)
    {

    }

    insertUser(data, connectedUser)
    {
        return new Promise((resolve, reject) =>
        {
            const isUserValid = checkUser(data)

            if (data.name === undefined)
                reject('User name required')
            else if (data.mail === undefined)
                reject('User email required')
            else if (isUserValid !== true)
                reject(isUserValid)
            else
            {
                const pass = data.pass ? data.pass : getRandPass(12)        
                require('bcrypt').hash(pass, 10)
                    .then(hash =>
                    {
                        return {
                            name: data.name,
                            hash: hash,
                            mail: data.mail,
                            role: data.role ? data.role : USER_ROLE.GUEST,
                            
                            token: null,
                            expire: Date.now()
                        }
                    })
                    .then(userData =>
                    {
                        this.database.insert(COLLECTION_NAME, userData)
                            .then(resolve)
                            .catch(reject)
                    })
                    .catch(err => reject(err.message))
            }
        })
    }

    getUser(data, connectedUser)
    {

    }

    getUsers(data, connectedUser)
    {

    }

    updateUser(data, connectedUser)
    {

    }

    deleteUser(data, connectedUser)
    {

    }
}
