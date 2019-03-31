const GetPostContent = {

    extractURLData(url)
    {
        if (url === null || url === undefined)
            return null
    
        const a = document.createElement('a')
        a.href = url.trim()
    
        // for( const element in a)
        // {
        //     if (typeof a[element] === typeof 'a')
        //         console.log(element, a[element])
        // }
        // console.log(a.origin, a.authority, a.search)
        // console.log(a.protocol, a.anchor)
    
        return {
            url: a.href,
            authority: a.host,
            path: a.pathname,
            search: a.search,
            anchor: a.hash
        }
    },

    isURL(content)
    {
        return content && content.type === 'url'
    },

    isEmbed(content)
    {
        return content && content.type === 'embed'
    },

    isText(content)
    {
        return content && content.type === 'text'
    },
    
    extractFormat(content)
    {
        if (GetPostContent.isURL(content)) {
            return ['url']
        } else if (GetPostContent.isEmbed(content)) {
            return ['embed']
        } else if (GetPostContent.isText(content)) {
            return ['text']
        }

        return []
    },
    
    extractContent(text)
    {
        /*
        url
            flux
                rss
                twitter
                youtube channel
            link
        embed
            video
                dailymotion
                vimeo
                youtube
            3d
                sketchfab
            
        text
            markdown
            html
        */
        // URL | text | embed
            // -> image | markdown | html  | video | RSS , jpeg | youtube
    
        // https://mathiasbynens.be/demo/url-regex
        if (text && text.trim().match(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/is) !== null) {
    
            const urlData = GetPostContent.extractURLData(text)
    
            return {
                type: 'url',
                raw: text.trim(),
    
                ...urlData
            }
        }
        else if (text && text.trim().match(/<iframe(.+)<\/iframe>/g) !== null)
        {
            console.log('<iframe>')
    
            const regExS = /<iframe[^\>]+src=["']?(.+?)["'\s\>]/gi
            const regExW = /<iframe[^\>]+width=["']?(\d+%?)/gi
            const regExH = /<iframe[^\>]+height=["']?(\d+%?)/gi
    
            const exS = regExS.exec(text)
            const exW = regExW.exec(text)
            const exH = regExH.exec(text)
    
            const src = exS && exS.length > 1 ? exS[1] : null
            const width = exW && exW.length > 1 ? exW[1] || 640 : 640
            const height = exH && exH.length > 1 ? exH[1] || 360 : 360
    
            const urlData = GetPostContent.extractURLData(src)
    
            return {
                type: 'embed',
                raw: text.trim(),
                width,
                height,
                ...urlData
            }
        }
        else
        {
            return {
                type: 'text',
                raw: text
            }
        }
    }
}

export default GetPostContent
