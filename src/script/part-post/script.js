import config from '../../config'
import api from '../utils/api'

export default
{
    components:
    {
    },

    props:
    {
        data: { type: Object },
        displayMode: { type: String, default: 'text' }
    },

    data()
    {
        return {
            displayImage: false,
            classData: [],
            // isHidden: true,
            postStyle: { },
            thumbStyle: false,
            isThumbLoaded: false,
            href: false
        }
    },

    created()
    {
        const size = this.getSize()

        if (size[0] / size[1] > 2.5)
            this.setSize(3, 1)
        else if (size[0] / size[1] > 1.5)
            this.setSize(2, 1)
        else if (size[1] / size[0] > 2.5)
            this.setSize(1, 3)
        else if (size[1] / size[0] > 1.5)
            this.setSize(1, 2)
        else
            this.setSize(2, 2)
        
        if (this.getThumb() && this.displayMode === 'thumb')
            this.postStyle = { 'background-color': this.getThumb().colors[0] }

        if (this.displayMode === 'text' && this.data.content_link)
            this.href = this.data.content_link
    },

    mounted()
    {
        if (this.getThumb())
            this.optimizeLoad()
    },

    methods:
    {
        optimizeLoad()
        {
            const options = {
                root: null,
                rootMargin: '0px',
                threshold: [0, 1]
            }
            
            this._observer = new IntersectionObserver(this.onInOut, options)
            this._observer.observe(this.$el)
        },

        onInOut(data)
        {
            if (data[0].intersectionRatio > 0)
            {
                if (!this.isThumbLoaded)
                {
                    this._thumb = new Image()
                    this._thumb.onload = () =>
                    {
                        this.isThumbLoaded = true
                    }
                    this._thumb.src = this.getThumb().url
                    if (this._thumb.complete)
                    {
                        this.isThumbLoaded = true
                    }
                }

                this.thumbStyle = {
                    'background-image': 'url(' + this.getThumb().url + ')'
                }
            }
            else
            {
                if (this._thumb && !this.isThumbLoaded)
                {
                    this._thumb.src = null
                    this._thumb = null
                }
                this.thumbStyle = false
            }
        },

        setSize(w = 1, h = 1)
        {
            const areaMax = 12
            const areaMin = 4
            const area = w * h
            const areaDo = this.data.score * (areaMax - areaMin) + areaMin

            const sideMax = 6
            const sideMin = 1

            let mult = 1
            while (w * (mult + 1) * h * (mult + 1) <= areaDo && Math.max(w * mult + 1, h * mult + 1) < sideMax)
                mult++
            
            this.classData.push('w' + w * mult, 'h' + h * mult)
        },

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