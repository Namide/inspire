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
            posts: []
        }
    },

    watch:
    {
        filterTags(tags)
        {
            api.getPosts(this.onPosts)
        }
    },

    created()
    {
        api.getPosts(this.onPosts)
    },

    methods:
    {
        onPosts(posts)
        {
            const cleanTags = tag => tag.toLowerCase()

            const filterTags = this.filterTags.map(cleanTags)
            const filter = post =>
            {
                const tags = post.tags.map(cleanTags)
                for(const tag of filterTags)
                    if (!tags.includes(tag))
                        return false
            
                return true
            }

            const filteredPosts = posts.entries.filter(filter)
            this.posts.splice(0, this.posts.length, ...JSON.parse(JSON.stringify(filteredPosts)))
        }
    }
}