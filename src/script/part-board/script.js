import config from '../../config'

export default
{
    components:
    {
        
    },

    props:
    {
        data: { type: Object }
    },

    data()
    {
        return {
            posts: []
        }
    },

    created()
    {
        
    },

    methods:
    {
        path(relative)
        {
            return config.assets.url + relative
        }
    }
}