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
        info: { type: Object, default: 1 },
        onlyImg: { type: Boolean, default: false }
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
        this.finalSrc = this.src
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
