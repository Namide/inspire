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
        isImg()
        {
            return this.data.type == 'image/jpeg'
        }
        // image(relative)
        // {
        //     return config.api.url.images + relative
        // }
    }
}