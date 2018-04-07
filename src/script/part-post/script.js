import config from '../../config'
import api from '../utils/api'
import PartAsset from '../part-asset'

export default
{
    components:
    {
        PartAsset
    },

    props:
    {
        data: { type: Object }
    },

    data()
    {
        return {
            postClass: {},
            displayImage: false
        }
    },

    created()
    {
        const isThumb = this.isThumb()
        this.postClass = {
            'is-thumb': isThumb,
            'is-text': !isThumb
        }
    },

    methods:
    {
        isThumb()
        {
            return !!this.data.thumb
                || !!this.data.content_file
        }
    }
}