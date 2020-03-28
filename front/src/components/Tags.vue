<template>
  <div @click="focusNewTag()" :class="{ 'read-only': readOnly }" class="tags">
    <span
      v-for="(tag, index) in tagsData"
      :key="index"
      class="input-tag"
      :class="{ 'is-': tag.type }"
    >
      <span :class="{ 'is-not': tag.no }">
        {{ tag.word }}
      </span>
      <a
        v-if="!readOnly"
        @click.prevent.stop="remove(index)"
        class="remove"
      ></a>
    </span>
    <input
      v-if="!readOnly && !isLimit"
      ref="inputtag"
      :placeholder="placeholder"
      type="text"
      v-model="newTag"
      v-on:keydown.delete.stop="removeLastTag"
      v-on:keydown="addNew"
      v-on:blur="addNew"
      class="new-tag"
    />
  </div>
</template>

<script>
import { parseItem } from '../pure/tagHelpers.js'

// Original code from vue-input-tag (https://www.npmjs.com/package/vue-input-tag)
const VALIDATORS = {
  // email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  // url: /^(https?|ftp|rmtp|mms):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i,
  // text: /^[a-zA-Z]+$/,
  // digits: /^[\d() \.\:\-\+#]+$/,
  // isodate: /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/
}

const VALIDATE = ''
const ADD_TAG_ON_KEYS = [
  13, // Return
  188, // Comma ','
  9 // Tab
]
const ADD_TAG_ON_BLUR = false
const LIMIT = -1

export default {
  props: {
    filter: { type: Array, default: () => [] },
    placeholder: { type: String, default: 'Filters (#tag, $type, @author, !not)' },
    readOnly: { type: Boolean, default: false }
  },

  data () {
    return {
      newTag: '',
      tags: [...this.filter]
    }
  },

  watch: {
    filter () {
      this.tags = [...this.filter]
    }
  },

  computed: {
    isLimit () {
      return LIMIT > 0 && Number(LIMIT) === this.tags.length
    },

    tagsData () {
      return this.tags.map(parseItem)
    }
  },

  methods: {
    tagHelpers (item) {
      return parseItem(item)
    },

    focusNewTag () {
      if (this.readOnly || !this.$el.querySelector('.new-tag')) {
        return
      }

      this.$el.querySelector('.new-tag').focus()
    },

    addNew (e) {
      // Do nothing if the current key code is
      // not within those defined within the ADD_TAG_ON_KEYS prop array.
      if (
        (e &&
          ADD_TAG_ON_KEYS.indexOf(e.keyCode) === -1 &&
          (e.type !== 'blur' || !ADD_TAG_ON_BLUR)) ||
        this.isLimit
      ) {
        return
      }

      if (e) {
        e.stopPropagation()
        e.preventDefault()
      }

      if (
        this.newTag &&
        this.tags.indexOf(this.newTag) === -1 &&
        this.validateIfNeeded(this.newTag)
      ) {
        this.tags.push(this.newTag)
        this.newTag = ''
        this.tagChange()
      }
    },

    validateIfNeeded (tagValue) {
      if (VALIDATE === '' || VALIDATE === undefined) {
        return true
      } else if (
        typeof VALIDATE === 'string' &&
        Object.keys(VALIDATORS).indexOf(VALIDATE) > -1
      ) {
        return VALIDATORS[VALIDATE].test(tagValue)
      } else if (typeof VALIDATE === 'object' && VALIDATE.test !== undefined) {
        return VALIDATE.test(tagValue)
      }

      return true
    },

    remove (index) {
      this.tags.splice(index, 1)
      this.tagChange()
    },

    removeLastTag () {
      if (this.newTag) {
        return
      }

      this.tags.pop()
      this.tagChange()
    },

    tagChange () {
      this.$emit('change', this.tags)
    }
  }
}
</script>

<style lang="sass" scoped>
.tags
  background-color: #fff
  // border: 1px solid #ccc
  overflow: hidden
  padding-left: 4px
  padding-top: 4px
  cursor: text
  text-align: left
  -webkit-appearance: textfield
  display: flex
  flex-wrap: wrap

  &.read-only
    cursor: default

.input-tag
  background-color: #F07
  // border-radius: 2px
  // border: 1px solid #a5d24a
  color: #FFF
  display: inline-block
  font-size: 13px
  font-weight: 400
  margin-bottom: 4px
  margin-right: 4px
  padding: 2px 8px 2px 4px

  &.is-type
    background-color: #F70
  .is-not
    text-decoration: line-through

  .remove
    cursor: pointer
    font-weight: bold
    color: #FFF

    &:hover
      text-decoration: none

    &::before
      content: "✖"
      margin-left: 4px

.new-tag
  background: transparent
  border: 0
  color: #777
  font-size: 13px
  font-weight: 400
  margin-bottom: 6px
  margin-top: 1px
  outline: none
  padding: 4px
  padding-left: 0
  flex-grow: 1
</style>
