export default class Post
{
    constructor(data = {})
    {
        this.data = data
    }

    getColor()
    {
        return this.data.thumb && this.data.thumb.colors && this.data.thumb.colors.length > 0 ? this.data.thumb.colors[0] : 'rgba(0,0,0,0)'
    }

    getImg()
    {
        return this.data.thumb ? this.data.thumb : null
    }

    getThumbSrc()
    {
        return this.getImg() ? this.data.thumb.src : null
    }

    getFileSrc()
    {
        return this.data.content && this.data.content.type && this.data.content.type === 'file' && this.data.content.src
    }

    isEmbed()
    {
        return this.data.content && this.data.content.type && this.data.content.type === 'embed'
    }

    isURL()
    {
        return this.data.content && this.data.content.type && this.data.content.type === 'url'
    }

    isText()
    {
        return this.data.content && this.data.content.type && this.data.content.type === 'text'
    }
}