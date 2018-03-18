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
        console.log(this.data)
    },

    methods:
    {
        path(relative)
        {
            return config.assets.url + relative
        }
    }
}