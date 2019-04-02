const imgIsValid = (obj, label) =>
{
    for (const key in obj)
    {
        const value = value[key]
        switch (key)
        {
            case 'path' :
                if (typeof value !== typeof '')
                    return label + '.path must be a string'
                if (value.length > 1024)
                    return label + '.path can not exceed 1024 characters'
                break
            case 'width' :
                if (typeof value !== typeof 2)
                    return label + '.width must be a number'
                if (value > -1 && value < Infinity)
                    return label + '.width must be positive and finite'
                break
            case 'height' :
                if (typeof value !== typeof 2)
                    return label + '.weight must be a number'
                if (value > -1 && value < Infinity)
                    return label + '.height must be positive and finite'
                break
            default :
                return 'The property "' + label + '.' + key + '" don\'t exist'
        }
    }

    return true
}

const postIsValid = post =>
{
    for (const key in post)
    {
        const value = post[key]
        switch (key)
        {
            case 'title' :
                if (typeof value !== typeof '')
                    return 'Title must be a string'
                if (value.length > 128)
                    return 'Title can not exceed 128 characters'
                break
            case 'description' :
                if (typeof value !== typeof '')
                    return 'Description must be a string'
                if (value.length > 1024)
                    return 'Description can not exceed 1024 characters'
            case 'tags' :
                if (typeof value !== typeof [])
                    return 'Tags must be an array'
                if (!value.reduce((a, b) => a && typeof b === typeof '', true))
                    return 'Every tags must be strings'
            
                break
            // case 'tags' :
            //     if (typeof value !== typeof '')
            //         return 'Tags must be a string with "," to separate tags'
            
                break
            case 'date' :
                if (typeof value !== typeof 2)
                    return 'Date must be a number'
                if (!(value > -1 && value < Infinity))
                    return 'Date must be positive and finite'
            
                break
            case 'public' :
                if (value !== true && value !== false)
                    return 'Public must be a boolean'
            
                break
            case 'score' :
                if (typeof value !== typeof 2)
                    return 'Score must be a number'
                if (!(value >= 0 && value <= 10))
                    return 'Score must be between 0 and 10'
            
                break
            case 'thumb' :
                const isValid = imgIsValid(value, 'Thumb')
                if (!isValid)
                    return isValid
                break
            case 'content' :
                if (typeof value !== typeof {})
                    return 'Content must be an object'
                break
            default :
                return 'The property "' + key + '" don\'t exist'
        }
    }

    return true
}

const formatPost = post =>
{
    const base = {
        title: String,
        description: String,
        tags: [String],
        date: Number,
        public: Boolean,
        score: Number,
        thumb: {},
        content: {}
    }

    const test = (post, base) =>
    {
        if (Array.isArray(base))
            return post.map(value => test(value, base[0]))
        else if (typeof base === typeof {})
        {
            for (key in post)
                post[key] = test(post[key], base[key])
            return post
        }
        else if (base === String)
            return String(post)
        else if (base === Boolean)
            return Boolean(post)
        else if (base === Number)
            return Number(post)
        else
            return post
    }

    return test(post, base)
}

module.exports = { postIsValid, formatPost }