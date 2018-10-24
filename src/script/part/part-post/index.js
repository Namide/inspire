import { h, app } from 'hyperapp'
import './style.sass'

const getPgcd = (a, b) =>
{ 
    while (b > 0)
    {  
        var r = a % b 
        a = b 
        b = r 
    }

    return a
}

const getColor = data =>
{
    return data.thumb && data.thumb.colors && data.thumb.colors.length > 0 ? data.thumb.colors[0] : 'rgba(0,0,0,0)'
}

const getImg = data =>
{
    return data.thumb ? data.thumb : null
}

const getThumbSize = data =>
{
    const thumb = getImg(data)
    return thumb ? [thumb.width, thumb.height] : [3, 1]
}

const getPostSize = (data, w = 1, h = 1) =>
{
    const areaMax = 12
    const areaMin = 4
    const area = w * h
    const areaDo = data.score * (areaMax - areaMin) + areaMin

    const sideMax = 6
    const sideMin = 1

    let mult = 5
    while (w * (mult + 1) * h * (mult + 1) <= areaDo && Math.max(w * mult + 1, h * mult + 1) < sideMax)
        mult++
    while (Math.max(w * mult, h * mult) > sideMax)
        mult--

    w *= mult
    h *= mult
    
    return [w, h]
    // this.$set(this.postStyle, 'grid-column-end', 'span ' + w * mult)
    // this.$set(this.postStyle, 'grid-row-end', 'span ' + h * mult)
}

const getClassList = (data, displayMode) => 
{
    const thumbSize = getThumbSize(data)

    const max = 6
    let w = 1
    let h = 1
    if (thumbSize[0] > thumbSize[1])
    {
        w = max
        h = Math.round(w * thumbSize[1] / thumbSize[0]) || 1
    }
    else
    {
        h = max
        w = Math.round(h * thumbSize[0] / thumbSize[1]) || 1
    }

    const p = getPgcd(w, h)
    w /= p
    h /= p

    const size = getPostSize(data, w, h)
    
    /*if (getImg(data) && displayMode === 'thumb')
    {
        this.$set(this.postStyle, 'background-color', this.getColor())
    }*/

    /* if (displayMode === 'text'
        && data.content_format.indexOf('URL') > -1)
        this.href = this.data.content.URL */


    return 'post w' + size[0] + ' h' + size[1]
}

const getStyle = (data, displayMode) =>
{
    return getImg(data) && displayMode === 'thumb' ? { 'backgroundColor': getColor(data) } : {}
}

const getHref = (data, displayMode) =>
{
    return (displayMode === 'text' && data.content_format.indexOf('URL') > -1) ? data.content.URL : ''
}

const create = (el, data, observer) =>
{
    if (getImg(data))
    {
        el._thumbSrc = getImg(data).src
        observer.observe(el)
    }
}

const destroy = (el, data, observer) =>
{
    if (getImg(data))
    {
        observer.unobserve(el)
    }
}

export default ({ match, data, displayMode, observer }) => (state, actions) =>
{
    return (
        <a href={ getHref(data) }
            target="blank"
            class={ getClassList(data, displayMode) }
            style={ getStyle(data, displayMode) }
            oncreate={ el => create(el, data, observer) }
            ondestroy={ el => destroy(el, data, observer) } /*:class="classData" :style="postStyle" oncreate={ setSize() }*/>

            {
                getImg(data) ? <div style={ 'background-image: url(' + data.thumb.src + ')' } class="thumb"></div> : ''
            }
            

            <h1 class="title">
                { data.title }
            </h1>

            <time class="date">
                { data.date }
            </time>

            <p class="description">
                { data.description }
            </p>

            <ul class="tags">
                { data.tags && data.tags.map(tag => (
                    <li class="tag">
                        { tag }
                    </li>
                )) }
            </ul>

            <span class="score">
                { data.score }/5
            </span>

        </a>
    )
}

/* 
    <transition name="thumbfade">
        <div v-if="isThumbLoaded && thumbStyle" :style="thumbStyle" class="thumb"></div>
    </transition>
 */




/*

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

        if (this.displayMode === 'text'
            && this.data.content_format.indexOf('URL') > -1)
            this.href = this.data.content.URL
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
            return this.data.thumb ? this.data.thumb :
                   this.data.content_format 
                   && this.data.content_format.indexOf('file') > -1
                   && this.data.content_format.indexOf('image')
                   && this.content ? this.data.content : null
        },

        getSrc()
        {
            if (this.data.thumb)
                return api.getThumbURL(this.data.uid)
            else if (this.data.content_format.indexOf('file') > -1
                     && this.data.content_format.indexOf('image')
                     && this.content)
                return api.getFileURL(this.data.uid)

            return ''
        }
    }
}
*/
