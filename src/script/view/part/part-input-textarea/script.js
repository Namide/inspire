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
