import marked from 'marked'
import GetPostContent from '../utils/GetPostContent'

// https://css-tricks.com/choosing-right-markdown-parser/#article-header-id-0

console.log(marked)

export default
{
    /*components:
    {
        
    },*/

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

    /*data()
    {
        return {
            
        }
    },

    watch:
    {
        data(data) {

        }
    },

    created()
    {
        
    },*/

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
}