import { h, app } from 'hyperapp'
import './style.sass'

export default ({ src = '', onlyImage = false, isImg = true, onchange, info = {} }) => (state, actions) =>
{
    const fileChange = event =>
    {
        const files = event.target.files
        console.log(files)
        onchange(files)
    }

    const deleteFile = () =>
    {
        console.error('TODO')
        // this.$emit('file', null)
        onchange(null)
    }

    const displayInfos = info => Object.keys(info).map(key => (
        <div>
            {
                key === 'colors' ?
                    <small>
                        <strong>{ key }</strong>:
                        { info[key].map(color => <span class="color" style={ 'background:' + color }></span>) }
                    </small>
                :
                    <small>
                        <strong>{ key }</strong>: { info[key] }
                    </small>
            }
        </div>
    ))

    return (
        <div>
            {
                !src ? 
                
                <input type="file" onchange={ event => onchange(event.target.files) } accept={ onlyImage ? 'image/*' : '*' } />
                
                :

                <button onclick={ () => onchange(null) }>Delete image</button>
            }
            
            {
                isImg && src !== '' ?

                    <div class="file-img" style={ 'background-image:url(' + src + ')' }>
                        displayInfos(info || {})
                    </div>

                : 
                    displayInfos(info || {})
            }

        </div>
    )
}


/*

const STATE = {
    INITIAL: 0,
    MODIFY: 1,
    MODIFIED: 2,
    UPDATE: 3,
    ERROR: 4
}

export default
{
    props:
    {
        src: { type: String, default: '' },
        info: { type: Object, default: null },
        onlyImage: { type: Boolean, default: false }
    },

    watch:
    {
        src(src)
        {
            this.finalSrc = src
        }
    },

    data()
    {
        return {
            finalSrc: '',
            isImg: true,
            state: STATE.INITIAL
        } 
    },

    created()
    {
        this.finalSrc = this.src || ''
    },

    methods:
    {
        filesChange([file])
        {
            const isImage = file.type.split('/').shift().toLowerCase() === 'image'
            if (isImage)
                this.imgViewer(file)

            this.$emit('file', file)
            
            this.state = STATE.MODIFY
        },

        deleteFile()
        {
            this.$emit('file', null)
        },

        imgViewer(file)
        {
            if (file.size > 1e9)
            {
                this.finalSrc = ''
                return console.warn('image too big!')
            }
            
            const reader = new FileReader()
            reader.addEventListener('load', event => this.finalSrc = event.target.result)
            reader.readAsDataURL(file)
        }
    }  
}
*/