import { h, app } from 'hyperapp'
import './style.sass'
import Post from '../../../model/Post'

const getTypeRatioHtml = post =>
{
    const content = post.content
    if (post.isURL())
    {
        return {
            ratio: null,
            type: 'url',
            html: '<a href="' + content.raw
                + '" target="_blank" rel="noreferrer noopener">'
                + content.raw.replace(/http:\/\/|https:\/\//, '')
                + '</a>'
        }
    }
    else if (post.isEmbed())
    {
        let ratio
        if (content.height && content.width) {
            ratio = (100 * content.height / content.width).toFixed(3) + '%'
        } else {
            ratio = '56.25%'
        }

        return {
            ratio,
            type: 'embed',
            html: content.raw
        }
        
    }
    else if (post.isText())
    {
        return {
            ratio: null,
            type: 'text',
            html: content.raw // marked(content.raw)
        }
    }
    else 
    {
        const html = Object.keys(content || {}).map(key => html += '<div><strong>'
            + key + '</strong>: '
            + content[key] + '</div>').join('')

        return {
            html,
            ratio: null,
            type: 'raw'
        }
    }
}

export default ({ post }) => (state, actions) =>
{
    const { html, type, ratio } = getTypeRatioHtml(post)

    return (<div class={ 'content is-' + type + ' ' + (ratio ? 'content_has-ratio' : '') }>

        { ratio ? <div class="content_dummy" style={ 'padding-top:' + ratio }></div> : '' }
        <div innerHTML={ html } class="content_data"></div>
        
    </div>)
}



/*
import marked from 'marked'
import GetPostContent from '../utils/GetPostContent'

// https://css-tricks.com/choosing-right-markdown-parser/#article-header-id-0

console.log(marked)

export default
{
    props:
    {
        data: { type: Object }
    },

    data() {
        return {
            html: '',
            type: 'raw',
            ratio: null
        }
    },

    watch:
    {
        data: 'setContent'
    },

    methods:
    {
        setContent(data)
        {
            if (GetPostContent.isURL(data))
            {
                this.ratio = null
                this.type = 'url'
                this.html = '<a href="' + data.raw
                            + '" target="_blank" rel="noreferrer noopener">'
                            + data.raw.replace(/http:\/\/|https:\/\//, '')
                            + '</a>'
            }
            else if (GetPostContent.isEmbed(data))
            {
                if (data.height && data.width) {
                    this.ratio = (100 * data.height / data.width).toFixed(3) + '%'
                } else {
                    this.ratio = '56.25%'
                }
                this.type = 'embed'
                this.html = data.raw
            }
            else if (GetPostContent.isText(data))
            {
                this.ratio = null
                this.type = 'text'
                this.html = marked(data.raw)
            }
            else 
            {
                let html = ''
                for (const key in data) {
                    html += '<div><strong>' + key + '</strong>: '
                            + data[key] + '</div>'
                }

                this.ratio = null
                this.type = 'raw'
                this.html = html
            }
        }
    }
}*/
