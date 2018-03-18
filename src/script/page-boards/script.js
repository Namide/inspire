import api from '../utils/api'
import PartPost from '../part-post'

export default
{
    components:
    {
        PartPost
    },

    data()
    {
        return {
            posts: []
        }
    },

    created()
    {
        api.getBoards(this.onPosts)
    },

    methods:
    {
        onPosts(posts)
        {
            this._allPosts = posts.entries
            this.posts = JSON.parse(JSON.stringify(posts.entries))
        }
    }
}