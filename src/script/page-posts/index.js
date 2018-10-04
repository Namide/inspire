import { h, app } from 'hyperapp'
import './style.sass'
import PartPost from '../part-post'

let displayMode = 'thumb'

const IOOptions = {
    root: null,
    rootMargin: '0px',
    threshold: [0, 1]
}

const removeObserver = observer => observer.disconnect()

export default ({ posts }) => (state, actions) => 
{
    const observer = new IntersectionObserver(onInOuts, IOOptions)

    return (
        <div class={ 'posts ' + 'is-' + displayMode } oncreate={ () => actions.loadPosts() } ondestroy={ () => observer.disconnect() } >
            { state.posts.map(post => <PartPost id={ post.uid } data={ post } displayMode={ displayMode } observer={ observer }></PartPost> ) }
        </div>
    )
}

const onInOuts = (list) =>
{
    list.forEach(onInOut)
}

const onInOut = data =>
{
    const el = data.target
    if (data.intersectionRatio > 0)
    {
        if (!el._isThumbLoaded)
        {
            el._thumb = new Image()
            el._thumb.onload = () =>
            {
                el._isThumbLoaded = true
                el.classList.add('is-loaded')
            }
            el._thumb.src = el._thumbSrc
            if (el._thumb.complete)
            {
                el._isThumbLoaded = true
                el.classList.add('is-loaded')
            }
        }

        el.classList.add('is-in')
    }
    else
    {
        if (el._thumb && !el._isThumbLoaded)
        {
            el._thumb.src = null
            el._thumb = null
        }

        el.classList.remove('is-in')
    }
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