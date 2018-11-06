import { h, app } from 'hyperapp'
import './style.sass'

// Original code from vue-input-tag (https://www.npmjs.com/package/vue-input-tag) 
/*const VALIDATORS = {
    email: new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
    url: new RegExp(/^(https?|ftp|rmtp|mms):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i),
    text: new RegExp(/^[a-zA-Z]+$/),
    digits: new RegExp(/^[\d() \.\:\-\+#]+$/),
    isodate: new RegExp(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/)
}

const VALIDATE = ''*/
/*const ADD_TAG_ON_BLUR = false
const LIMIT = -1

const focusNewTag = () => console.log('focusNewTag()')


<span v-for="(tag, index) in innerTags" :key="index" class="input-tag" :class="{ 'is-type': tag[0] === '@' || (tag[0] + tag[1] === '@!') }">
            <span :class="{ 'is-not': tag[0] === '!' || (tag[0] + tag[1] === '@!') }">
                {{ tag[0] + tag[1] == '!@' || tag[0] + tag[1] == '@!' ? tag.substr(2) : tag[0] == '!' || tag[0] == '@' ? tag.substr(1) : tag }}
            </span>
            <a v-if="!readOnly" @click.prevent.stop="remove(index)" class="remove"></a>
        </span>
        <input
            v-if = "!readOnly && !isLimit"
            ref = "inputtag"
            :placeholder = "placeholder"
            type = "text"
            v-model = "newTag"
            v-on:keydown.delete.stop = "removeLastTag"
            v-on:keydown = "addNew"
            v-on:blur = "addNew"
            class = "new-tag"/>
            */

const ADD_TAG_ON_KEYS = [
    13,     // Return, Enter
    188,    // Comma ','
    9       // Tab
]

const isNot = tag => tag[0] === '!' || (tag[0] + tag[1] === '@!')
const isType = tag => tag[0] === '@' || (tag[0] + tag[1] === '@!')
const extractRaw = tag => tag[0] + tag[1] === '!@' || tag[0] + tag[1] === '@!' ? tag.substr(2) : tag[0] === '!' || tag[0] == '@' ? tag.substr(1) : tag

const addChar = (evt, state) => console.log(evt.target.value)
const addTags = (evt, actions, state) => actions.addTags(evt.target.value.split(','))
const removeTag = (tag, actions) => actions.removeTag(tag)

export default ({ match, data, displayMode, observer }) => (state, actions) =>
{
    const tags = []

    return (<div class="tags">
        
        {state.filter.tags.map(tag => (
            <span class={ isType(tag) ? 'input-tag is-type' : 'input-tag' }>
                <span class={ isNot(tag) ? 'is-not': '' }>
                { extractRaw(tag) }
                </span>
                <a v-if="!readOnly" onclick={() => removeTag(tag, actions)} class="remove"></a>
            </span>
        ))}
        
        <input placeholder = "Filters (tag, @type, !not)"
            type="text"
            oncreate={el => el.focus()}

            // onblur={evt => addChar(evt, state)}
            // oninput={evt => addChar(evt, state)}
            onkeyup={evt => ADD_TAG_ON_KEYS.indexOf(evt.keyCode) > -1 ? addTags(evt, actions, state) : false }

            class="new-tag"/>
    </div>)   
}

/*

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
*/