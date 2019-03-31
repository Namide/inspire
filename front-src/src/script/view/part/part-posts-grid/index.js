import { h, app } from 'hyperapp'
import './style.sass'
import PartPostGrid from '../../part/part-post-grid'

const IOOptions = {
    root: null,
    rootMargin: '0px',
    threshold: [0, 1]
}

export default ({ isAdmin = false, onPostClick = null }) => (state, actions) => 
{
    const observedDataList = []

    const observerSubscribe = (el, onIn, onOut) =>
    {
        observedDataList.push({ el, onIn, onOut })
        observer.observe(el)
    }
    
    const observerUnsubscribe = el =>
    {
        observer.unobserve(el)

        const index = observedDataList.findIndex(data => data.el === el)
        if (index > -1)
            observedDataList.splice(index, 1)
    }

    const onInOut = data =>
    {
        const el = data.target
        const observedData = observedDataList.find(od => od.el === el)
        if (data.intersectionRatio > 0)
            observedData.onIn()
        else
            observedData.onOut()
    }
    const onInOuts = list => list.forEach(onInOut)

    const observer = new IntersectionObserver(onInOuts, IOOptions)

    return (
        <div class="posts-grid" oncreate={ () => actions.loadPosts() } ondestroy={ () => observer.disconnect() } >
            { 
                state.posts.map(post => (
                    <PartPostGrid id={ post.uid }
                        onOpen={ onPostClick }
                        data={ post }
                        observerSubscribe={ observerSubscribe }
                        observerUnsubscribe={ observerUnsubscribe }>
                    </PartPostGrid>
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