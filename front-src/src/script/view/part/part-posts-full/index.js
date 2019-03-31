import { h, app } from 'hyperapp'
import './style.sass'
import PartPostFull from '../../part/part-post-full'

export default ({ onPostClick = null }) => (state, actions) => 
{
    return (
        <div class="posts-full" oncreate={ () => actions.loadPosts() } >
            { 
                state.posts.map(post => (
                    <PartPostFull id={ post.uid }
                        onOpen={ onPostClick }
                        data={ post }>
                    </PartPostFull>
                ))
            }
        </div>
    )
}


/*
// import apiGet from '../utils/apiGet'
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

            this.$store.dispatch('getPosts', {tags, noTags, types, noTypes})
            // apiGet.getPosts(this.onPosts, { tags, noTags, types, noTypes })
        }
    },

    created()
    {
        this.$store.dispatch('getPosts')
        // apiGet.getPosts(this.onPosts)
    },

    methods:
    {
        onPosts({data, meta})
        {
            this.displayMode = 'thumb'
            this.$store.commit('updatePosts', data)
        }
    }
}*/