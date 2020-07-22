<template>
  <tr>
    <td v-for="{ name: cellName } of cellsVisible" :key="cellName" class="cell">
      <Loader
        v-if="itemInput.tableItemState[cellName] === STATES.SAVING"
        class="loader"
        size="small"
      />

      <template v-if="cellName === 'tags'">
        <Tags
          :filter="itemInput[cellName] || []"
          @change="val => (itemInput[cellName] = val)"
          placeholder="Tags (separated by comas)"
        />
      </template>

      <template v-else-if="cellName === 'visibility'">
        <select
          v-model="itemInput[cellName]"
          @change="
            save({
              label: cellName,
              itemID: itemInput.id,
              value: itemInput[cellName]
            })
          "
          class="editable"
          :class="'is-' + itemInput.tableItemState[cellName]"
        >
          <option
            :value="visibility.value"
            :key="visibility.value"
            v-for="visibility in visibilities"
            v-html="visibility.label"
          ></option>
        </select>
      </template>

      <template v-else-if="cellName === 'types'">
        <span
          v-for="type of itemInput[cellName]"
          v-html="type"
          :key="itemInput.id + '.' + cellName + '.' + type"
          class="type"
        ></span>
      </template>

      <template v-else-if="cellName === 'title'">
        <input
          type="text"
          v-model="itemInput[cellName]"
          @blur="
            save({
              label: cellName,
              itemID: itemInput.id,
              value: itemInput[cellName]
            })
          "
          class="editable"
          :class="'is-' + itemInput.tableItemState[cellName]"
        />
      </template>

      <template v-else-if="cellName === 'description'">
        <InputTextarea
          v-model="itemInput[cellName]"
          placeholder="Description"
          @blur.native="
            save({
              label: cellName,
              itemID: itemInput.id,
              value: itemInput[cellName]
            })
          "
          class="editable"
          :class="'is-' + itemInput.tableItemState[cellName]"
        />
      </template>

      <template
        v-else-if="
          cellName === 'image' || cellName === 'file' || cellName === 'content'
        "
      >
        <InputMarkdown
          v-if="itemInput['content']"
          v-model="itemInput['input']"
          @input="val => updateContent(itemInput, val)"
          @submit="val => updateContent(itemInput, val)"
          placeholder="Content (URL, markdown, HTML, embed...)"
        />
        <AdminFileLoader
          v-else-if="itemInput['file']"
          @change="file => fileChange(itemInput, cellName, file)"
          :image="itemInput['file']"
          :only-img="false"
          size="small"
        />
        <AdminFileLoader
          v-else-if="itemInput['image']"
          @change="file => fileChange(itemInput, cellName, file)"
          :image="itemInput['image']"
          :only-img="true"
          :size="'small'"
        />
      </template>

      <template v-else-if="cellName === 'score'">
        <input
          type="number"
          min="0"
          max="5"
          step="0.1"
          v-model="itemInput[cellName]"
          @blur="
            save({
              label: cellName,
              itemID: itemInput.id,
              value: Number(itemInput[cellName])
            })
          "
          class="editable"
          :class="'is-' + itemInput.tableItemState[cellName]"
        />
      </template>

      <template v-else>
        {{ itemInput[cellName] }}
      </template>
    </td>
    <td>
      <button @click="$emit('editItem', itemInput)">Edit</button>
    </td>
  </tr>
</template>

<script>
import apiSave from "@/pure/apiSave";
import Loader from "@/components/Loader.vue";
import Tags from "@/components/Tags.vue";
import { VISIBILITY } from "../../../web/app/constants/permissions";
import AdminFileLoader from "@/admin/AdminFileLoader.vue";
import { inputToContent } from "@/pure/ItemSave.js";
import InputTextarea from "@/admin/InputTextarea.vue";
import InputMarkdown from "@/admin/InputMarkdown.vue";
import tasksManager from "@/pure/tasksManager";

const STATES = {
  DEFAULT: "default",
  SAVING: "saving",
  SAVED: "saved",
  ERROR: "error"
};

export default {
  components: {
    AdminFileLoader,
    Loader,
    Tags,
    InputTextarea,
    InputMarkdown
  },

  props: {
    cellsVisible: {
      type: Array,
      required: true
    },
    item: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      STATES,
      visibilities: Object.values(VISIBILITY).map(value => ({
        value,
        label: value[0].toUpperCase() + value.slice(1)
      })),
      // state: {},
      itemInput: {}
    };
  },

  watch: {
    item: {
      handler(val) {
        this.itemInput = Object.assign(
          { tableItemState: {} },
          JSON.parse(JSON.stringify(val))
        );
      },
      immediate: true
    }
  },

  methods: {
    save({ label, itemID, value }) {
      if (this.item[label] === value) {
        return;
      }

      const oldState = this.itemInput.tableItemState.label;

      this.$set(this.itemInput.tableItemState, label, STATES.SAVING);

      const process = () => {
        apiSave
          .updateItem(itemID, { [label]: value })
          .then(() => {
            this.$set(this.itemInput.tableItemState, label, STATES.SAVED);
          })
          .catch(() => {
            this.$set(this.itemInput.tableItemState, label, STATES.ERROR);
          });
      };

      const cancel = () => {
        this.$set(this.itemInput.tableItemState, label, oldState);
      };

      const title = "Update " + label;
      const description =
        String(value).length > 30
          ? String(value).substring(0, 27) + "..."
          : String(value);

      tasksManager.add({
        uid: "item." + itemID + ".update." + label,
        title,
        description,
        process,
        cancel
      });
    },

    updateContent(item, value) {
      this.$set(item, "input", value);
      this.$set(item, "content", inputToContent(value));
    },

    fileChange(object, label, file = null) {
      if (file) {
        this.itemSave.updateByFile(file).then(itemSave => {
          this.$set(object, label, itemSave.getObject());
        });
      } else {
        this.itemSave.removeFile().then(itemSave => {
          this.$set(object, label, itemSave.getObject());
        });
      }
    }
  }
};
</script>

<style lang="sass" scoped>
@import "../style/settings.sass"

.cell
  position: relative

.loader
  position: absolute
  top: 50%
  left: 50%
  transform: translateX(-50%) translateY(-50%)

.type
  &:after
    content: ", "
  &:last-child:after
    display: none

.editable
  border: 2px grey solid

  &.is-saving
    border-color: yellow

  &.is-saved
    border-color: green

  &.is-error
    border-color: red
</style>
