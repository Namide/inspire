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
        image(relative)
        {
            return config.api.url.images + relative
        }
    }
}