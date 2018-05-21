// Original code from vue-input-tag (https://www.npmjs.com/package/vue-input-tag) 
const VALIDATORS = {
    email: new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
    url: new RegExp(/^(https?|ftp|rmtp|mms):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i),
    text: new RegExp(/^[a-zA-Z]+$/),
    digits: new RegExp(/^[\d() \.\:\-\+#]+$/),
    isodate: new RegExp(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/)
}

const VALIDATE = ''
const ADD_TAG_ON_KEYS = [
    13, // Return
    188, // Comma ','
    9 // Tab
]
const ADD_TAG_ON_BLUR = false
const LIMIT = -1

export default
{
    props:
    {
        tags: { type: Array, default: () => [] },
        placeholder: { type: String, default: 'Filters (tag, @type, !not)' },
        readOnly: { type: Boolean, default: false }
    },

    data ()
    {
        return {
            newTag: '',
            innerTags: [...this.tags]
        }
    },

    watch:
    {
        tags ()
        {
            this.innerTags = [...this.tags]
        }
    },

    computed:
    {
        isLimit: function ()
        {
            return LIMIT > 0 && Number(LIMIT) === this.innerTags.length
        }
    },

    methods:
    {
        focusNewTag ()
        {
            if (this.readOnly || !this.$el.querySelector('.new-tag'))
                return
        
            this.$el.querySelector('.new-tag').focus()
        },

        addNew (e)
        {
            // Do nothing if the current key code is
            // not within those defined within the ADD_TAG_ON_KEYS prop array.
            if ((e && ADD_TAG_ON_KEYS.indexOf(e.keyCode) === -1 &&
                (e.type !== 'blur' || !ADD_TAG_ON_BLUR)) || this.isLimit)
                return

            if (e)
            {
                e.stopPropagation()
                e.preventDefault()
            }

            if (this.newTag &&
                this.innerTags.indexOf(this.newTag) === -1 &&
                this.validateIfNeeded(this.newTag))
            {
                this.innerTags.push(this.newTag)
                this.newTag = ''
                this.tagChange()
            }
        },

        validateIfNeeded (tagValue)
        {
            if (VALIDATE === '' || VALIDATE === undefined)
                return true
            else if (typeof (VALIDATE) === 'string' && Object.keys(VALIDATORS).indexOf(VALIDATE) > -1)
                return VALIDATORS[VALIDATE].test(tagValue)
            else if (typeof (VALIDATE) === 'object' && VALIDATE.test !== undefined)
                return VALIDATE.test(tagValue)
            
            return true
        },

        remove(index)
        {
            this.innerTags.splice(index, 1)
            this.tagChange()
        },

        removeLastTag()
        {
            if (this.newTag)
                return

            this.innerTags.pop()
            this.tagChange()
        },

        tagChange ()
        {
            this.$emit('update:tags', this.innerTags)
        }
    }
}
