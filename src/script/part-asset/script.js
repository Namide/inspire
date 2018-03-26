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

    created()
    {
    },

    methods:
    {
        path(path)
        {
            // api.getThumb(path, data => console.log(data))
            return config.api.url.assets + path
        }

        // image(relative)
        // {
        //     return config.api.url.images + relative
        // }
    }
}