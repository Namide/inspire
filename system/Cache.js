const fs = require('fs')

const hash = str =>
{
    const arr = [];
    for (let n = 0; n < str.length; n++) 
    {
        const hex = Number(str.charCodeAt(n)).toString(16)
        arr.push(hex)
    }
    return arr.join('')
}

const removeCache = dir =>
{
    if(fs.existsSync(dir))
    {
        fs.readdirSync(dir).forEach(file =>
        {
            const curPath = dir + '/' + file
            if(fs.lstatSync(curPath).isDirectory())
                removeCache(curPath)
            else
                fs.unlinkSync(curPath)
        })

        fs.rmdirSync(dir)
    }
}

module.exports = class Cache
{
    constructor(dir)
    {
        this.dir = dir

        this.removeAll()
        this.init()
    }

    removeAll()
    {
        removeCache(this.dir)
    }

    init()
    {
        fs.mkdirSync(this.dir)
    }

    has(file)
    {
        fs.existsSync(this.dir + '/' + hash(file))
    }

    get(file)
    {
        hasCacheFile(file) ? fs.readFileSync(this.dir + '/' + hash(file)) : ''
    }

    add(file, content, time = 0)
    {
        fs.writeFile(this.dir + '/' + hash(file), content, err => err ? console.log(err) : 1)

        if (time > 0)
            setTimeout(() => this.removeCache(file), time)
    }

    remove(file)
    {
        if (this.hasCacheFile(file))
            fs.unlinkSync(this.dir + '/' + hash(file))
    }
}
