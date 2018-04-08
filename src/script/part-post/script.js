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
            displayImage: false,
            classData: []
        }
    },

    created()
    {
        const size = this.getSize()

        if (size[0] / size[1] >= 2.5)
            this.classData.push('w3', 'h1')
        else if (size[0] / size[1] >= 1.5)
            this.classData.push('w2', 'h1')
        else if (size[1] / size[0] >= 2.5)
            this.classData.push('w1', 'h3')
        else if (size[1] / size[0] >= 1.5)
            this.classData.push('w1', 'h2')
        else
            this.classData.push('w2', 'h2')

        console.log(this.getSize())
    },

    methods:
    {
        getSize()
        {
            const thumb = this.getThumb()
            if (thumb)
                return [thumb.width, thumb.height]

            return [3, 1]
        },

        getThumb()
        {
            return this.data.thumb ? this.data.thumb.data : this.data.content_file ? this.data.content_file.data : null 
        }
    }
}