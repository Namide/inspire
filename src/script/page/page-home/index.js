import { h, app } from 'hyperapp'
import PartTags from '../../part/part-tags'
import PagePosts from '../page-posts'
import './style.sass'

export default ({ match, data, displayMode, observer }) => (state, actions) =>
{
    return (<div>
        <h2>Home page</h2>
        <PartTags/>
        <PagePosts/>
    </div>)   
}

/* import PagePosts from '../page-posts'
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
}*/