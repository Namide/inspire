import api from '../utils/api'
import PagePosts from '../page-posts'
import PartTags from '../part-tags'

export default
{
    components:
    {
        PagePosts,
        PartTags
    },

    data()
    {
        return {
            filterTags: [],
            tags: []
        }
    },

    created()
    {
    },

    methods:
    {
        onFiltered(tags)
        {
            this.filterTags.splice(0, this.filterTags.length, ...tags)
        }
    }
}