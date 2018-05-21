import config from '../../config'
import api from '../utils/api'

const  getPgcd = (a, b) =>
{ 
    while (b > 0)
    {  
        var r = a % b 
        a = b 
        b = r 
    }

    return a
}

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
            href: false,
            w: 1,
            h: 1
        }
    },

    created()
    {
        const size = this.getSize()

        const max = 6
        let w = 1
        let h = 1
        if (size[0] > size[1])
        {
            w = max
            h = Math.round(w * size[1] / size[0]) || 1
        }
        else
        {
            h = max
            w = Math.round(h * size[0] / size[1]) || 1
        }

        const p = getPgcd(w, h)
        w /= p
        h /= p

        this.setSize(w, h)
        
        if (this.getImg() && this.displayMode === 'thumb')
        {
            this.$set(this.postStyle, 'background-color', this.getColor())
        }

        if (this.displayMode === 'text' && this.data.content_link)
            this.href = this.data.content_link
    },

    mounted()
    {
        if (this.getImg())
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
                    this._thumb.src = this.getSrc()
                    if (this._thumb.complete)
                    {
                        this.isThumbLoaded = true
                    }
                }

                this.thumbStyle = {
                    'background-image': 'url(' + this.getSrc() + ')'
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

            let mult = 5
            while (w * (mult + 1) * h * (mult + 1) <= areaDo && Math.max(w * mult + 1, h * mult + 1) < sideMax)
                mult++
            while (Math.max(w * mult, h * mult) > sideMax)
                mult--

            w *= mult
            h *= mult
            
            this.classData.push('w' + w, 'h' + h)
            // this.$set(this.postStyle, 'grid-column-end', 'span ' + w * mult)
            // this.$set(this.postStyle, 'grid-row-end', 'span ' + h * mult)
        },

        getSize()
        {
            const thumb = this.getImg()
            if (thumb)
                return [thumb.width, thumb.height]

            return [3, 1]
        },

        getColor()
        {
            return this.data.thumb && this.data.thumb.colors && this.data.thumb.colors.length > 0 ? this.data.thumb.colors[0] : 'rgba(0,0,0,0)'
        },

        getImg()
        {
            return this.data.thumb ? this.data.thumb : this.data.content_file ? this.data.content_file : null
        },

        getSrc()
        {
            if (this.data.thumb)
                return api.getThumbURL(this.data.uid)
            else if (this.data.content_file)
                return api.getFileURL(this.data.uid)

            return ''
        }
    }
}