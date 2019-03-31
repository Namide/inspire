import { h, app } from 'hyperapp'
import './style.sass'


export default ({ placeholder, value, onchange }) => (state, actions) =>
{
    // const el = this.$refs.contentRaw
    // this.$nextTick(() =>
    // {
    //     el.style.cssText = 'height:auto; padding:0'
    //     el.style.cssText = 'height:' + el.scrollHeight + 'px'
    // })
    let el

    const resizeContentRaw = () =>
    {
        el.style.cssText = 'height:auto;padding:0'
        el.style.cssText = 'height:' + el.scrollHeight + 'px'
    }

    const onCreate = element => 
    {
        el = element
        resizeContentRaw()
    }
    const onDestroy = el => window.removeEventListener('resize', resizeContentRaw)

    const change = () =>
    {
        resizeContentRaw()
        onchange(el.value)
    }

    // window.removeEventListener('resize', this.resizeContentRaw)
    window.addEventListener('resize', resizeContentRaw)

    return <textarea
        oncreate={ (el) => onCreate(el) }
        ondestroy={ (el) => onDestroy(el) }
        onchange={ () => change() }
        onkeydown={ () => change() }
        class="input-textarea"
        rows="1"
        placeholder={ placeholder }
    >{ value }</textarea>
}



/*

export default
{
    props:
    {
        placeholder: { type: String },
        value: { type: String }
    },

    data()
    {
        return {
            modelValue: null
        } 
    },

    watch:
    {
        value(value)
        {
            if (value !== this.modelValue)
                this.modelValue = value
        },

        modelValue(modelValue)
        {
            if (modelValue !== this.value)
            {
                this.$emit('change', modelValue)
                this.resizeContentRaw()
            }
        }

        // state(state)
        // {
            

        //     if (state !== STATE.INITIAL) {
        //         window.addEventListener('keyup', this.keyUp)
        //         window.addEventListener('resize', this.resizeContentRaw)
        //         this.resizeContentRaw()
        //     }
        // }
    },

    created()
    {
        this.modelValue = this.value
    },

    mounted()
    {
        this.resizeContentRaw()
        window.removeEventListener('resize', this.resizeContentRaw)
    },

    destroyed()
    {
        window.removeEventListener('resize', this.resizeContentRaw)
    },

    methods:
    {
        resizeContentRaw()
        {
            const el = this.$refs.contentRaw
            this.$nextTick(() =>
            {
                el.style.cssText = 'height:auto; padding:0'
                el.style.cssText = 'height:' + el.scrollHeight + 'px'
            })
        },

        submit()
        {
            this.$emit('submit', this.modelValue)
        }
    }
}
*/