import { h, app } from 'hyperapp'
import PartTags from '../../part/part-tags'
import PartPosts from '../../part/part-posts'
import './style.sass'

export default () => () =>
(
    <div>
        <h2>Home page</h2>
        <PartTags/>
        <PartPosts/>
    </div>
)

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