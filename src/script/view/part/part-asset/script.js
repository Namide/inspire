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

    created()
    {
    },

    methods:
    {
        isImg()
        {
            return this.data.type == 'image/jpeg'
        }
    }
}