import api from '../utils/api'
import PartPost from '../part-post'

export default
{
    components:
    {
        PartPost
    },

    props:
    {
        filterTypes: { type: Array, default: function() { return [] } },
        filterTags: { type: Array, default: function() { return [] } }
    },

    data()
    {
        return {
            posts: [],
            displayMode: 'thumb'
        }
    },

    watch:
    {
        filterTags(list)
        {
            const tags = []
            const types = []
            const noTags = []
            const noTypes = []
            list.forEach(item => 
            {
                const s = item[0] + item[1]
                const f = item[0]

                if (s === '!@' || s === '@!')
                    noTypes.push(item.substr(2))
                else if (f === '@')
                    types.push(item.substr(1))
                else if (f === '!')
                    noTags.push(item.substr(1))
                else
                    tags.push(item)
            })

            api.getPosts(this.onPosts, { tags, noTags, types, noTypes })
        }
    },

    created()
    {
        api.getPosts(this.onPosts)
    },

    methods:
    {
        onPosts({data, meta})
        {
            /*const cleanTags = tag => tag.toLowerCase()

            const filterTags = this.filterTags.map(cleanTags)
            const filter = post =>
            {
                const tags = post.tags.map(cleanTags)
                for(const tag of filterTags)
                    if (!tags.includes(tag))
                        return false
            
                return true
            }*/

            this.displayMode = 'thumb' // text

            /*const cleanData = data =>
            {
                const newData = JSON.parse(JSON.stringify(data))

                newData.tags = data.tags.split(',')

                if (data.thumb)
                    newData.thumb.data.colors = data.thumb.data.colors.split(',').map(color => '#' + color)

                if (data.content_file && data.content_file.data.colors)
                    newData.content_file.data.colors = data.content_file.data.colors.split(',').map(color => '#' + color)

                return newData
            }

            const posts = data.map(cleanData)*/
            this.posts.splice(0, this.posts.length, ...data)
        }
    }
}