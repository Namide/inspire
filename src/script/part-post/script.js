import config from '../../config'
import api from '../utils/api'

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
        assets(path)
        {
            return config.api.url.assets + path
        }
    }
}