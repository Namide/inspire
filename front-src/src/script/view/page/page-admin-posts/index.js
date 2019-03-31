import { h, app } from 'hyperapp'
import './style.sass'
import PartTags from '../../part/part-tags'
import PartPostsFull from '../../part/part-posts-full'
import PartAdminPostEdit from '../../part/part-admin-post-edit'
import PartModal from '../../part/part-modal'

export default ({ posts }) => (state, actions) => {

    const onPostClick = (post) => console.log(post)

    return (
        <div>
            <h2>Admin post</h2>
            <PartTags/>
            <button>+ Add new post</button>
            <PartPostsFull onPostClick={ data => actions.onEdit({ uid: data.uid }) }/>
            {
                state.edit ? <PartModal onClose={ actions.onEditClose }>
                    <PartAdminPostEdit data={ state.edit.data } />
                </PartModal> : ''
            }
        </div>

        // <PartPosts isAdmin={ true } onPostClick={ onPostClick } />
        
        // <part-admin-post insert={ true }></part-admin-post>
        // { state.posts.map(post => <PartPost id={ post.uid } data={ post } displayMode={ displayMode } observer={ observer }></PartPost> ) }
        // <part-admin-post v-for="post of posts" :key="post.uid" :post="post"></part-admin-post>
    )
}

/*

// import apiGet from '../utils/apiGet'
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

            this.$store.dispatch('getPosts', { tags, noTags, types, noTypes })
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
            this.displayMode = 'text' // 'thumb' // text
            this.$store.commit('updatePosts', data)
        }
    }
}*/