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
            posts: []
        }
    },

    created()
    {
    },

    methods:
    {
    }
}