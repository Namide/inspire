import apiGet from '../utils/apiGet'
import PartAdminPost from '../part-admin-post'

export default
{
    components:
    {
        PartAdminPost
    },

    props:
    {
        filterTypes: { type: Array, default: function() { return [] } },
        filterTags: { type: Array, default: function() { return [] } }
    },

    data()
    {
        return {
            displayMode: 'thumb'
        }
    },

    computed:
    {
        posts ()
        {
            return this.$store.state.posts
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

            apiGet.getPosts(this.onPosts, { tags, noTags, types, noTypes })
        }
    },

    created()
    {
        apiGet.getPosts(this.onPosts)
    },

    methods:
    {
        onPosts({data, meta})
        {
            this.displayMode = 'text' // 'thumb' // text
            this.$store.commit('updatePosts', data)
        }
    }
}