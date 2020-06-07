<template>
  <div>
    <Loader v-if="loading" />
    <template v-else>
      <div>
        <span>Disabled cells: </span>
        <span v-for="cell of hideCells" :key="cell.name">
          <label :for="cell.label" v-html="cell.label"></label>
          <input
            :id="cell.label"
            type="checkbox"
            v-model="fullCells[cell.name].enabled"
          />
        </span>
      </div>
      <table>
        <tr>
          <td v-for="cell of cells" :key="cell.name">
            <label :for="cell.label" v-html="cell.label"></label>
            <input
              :id="cell.label"
              type="checkbox"
              v-model="fullCells[cell.name].enabled"
            />
          </td>
        </tr>
        <tr v-for="item of items" class="item" :key="item.id">
          <td v-for="cell of cells" :key="item.id + '.' + cell.name">
            <template v-if="cell.name === 'tags'">
              <Tags
                :filter="item[cell.name] || []"
                @change="val => (item[cell.name] = val)"
                placeholder="Tags (separated by comas)"
              />
            </template>

            <template v-else-if="cell.name === 'visibility'">
              <select v-model="item[cell.name]">
                <option
                  :value="visibility.value"
                  :key="visibility.value"
                  v-for="visibility in visibilities"
                  v-html="visibility.label"
                ></option>
              </select>
            </template>

            <template v-else-if="cell.name === 'types'">
              <span
                v-for="label of item[cell.name]"
                v-html="label"
                :key="item.id + '.' + cell.name + '.' + label"
                class="type"
              ></span>
            </template>

            <template v-else-if="cell.name === 'title'">
              <input type="text" v-model="item[cell.name]" />
            </template>

            <template v-else-if="cell.name === 'description'">
              <textarea v-model="item[cell.name]"></textarea>
            </template>

            <template
              v-else-if="
                cell.name === 'image' ||
                  cell.name === 'file' ||
                  cell.name === 'content'
              "
            >
              <InputTextarea
                v-if="item['content']"
                v-model="item['input']"
                @input="val => updateContent(item, val)"
                @submit="val => updateContent(item, val)"
                placeholder="Content (URL, markdown, HTML, embed...)"
              />
              <AdminFileLoader
                v-else-if="item['file']"
                @change="file => fileChange(item, cell.name, file)"
                :image="item['file']"
                :only-img="false"
                :size="'small'"
              />
              <AdminFileLoader
                v-else-if="item['image']"
                @change="file => fileChange(item, cell.name, file)"
                :image="item['image']"
                :only-img="true"
                :size="'small'"
              />
            </template>

            <template v-else-if="cell.name === 'score'">
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                v-model="item[cell.name]"
              />
            </template>

            <template v-else>
              {{ item[cell.name] }}
            </template>
          </td>
        </tr>
      </table>
    </template>
  </div>
</template>

<script>
// import apiGet from '../utils/apiGet'
import Loader from "@/components/Loader.vue";
import ItemsLoader from "@/mixins/ItemsLoader.js";
import Tags from "@/components/Tags.vue";
import { VISIBILITY } from "../../../server/app/constants/permissions";
import AdminFileLoader from "@/admin/AdminFileLoader.vue";
import { inputToContent } from "@/pure/ItemSave.js";
import InputTextarea from "@/admin/InputTextarea.vue";

export default {
  mixins: [ItemsLoader],

  components: {
    AdminFileLoader,
    Loader,
    Tags,
    InputTextarea
  },

  data() {
    return {
      fullCells: {
        visibility: { label: "Visibility", enabled: true },
        types: { label: "Types", enabled: true },
        title: { label: "Title", enabled: true },
        description: { label: "Description", enabled: true },
        tags: { label: "Tags", enabled: true },
        content: { label: "Content", enabled: true },
        // file: { label: "File", enabled: true },
        // image: { label: "Image", enabled: true },
        score: { label: "Score", enabled: true },
        author: { label: "Author", enabled: false }
      },
      visibilities: Object.values(VISIBILITY).map(value => ({
        value,
        label: value[0].toUpperCase() + value.slice(1)
      }))
    };
  },

  computed: {
    cells() {
      return Object.keys(this.fullCells)
        .map(name => Object.assign({ name }, this.fullCells[name]))
        .filter(({ enabled }) => enabled);
    },
    hideCells() {
      return Object.keys(this.fullCells)
        .map(name => Object.assign({ name }, this.fullCells[name]))
        .filter(({ enabled }) => !enabled);
    }
  },

  methods: {
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

.items

.type
  &:after
    content: ", "
  &:last-child:after
    display: none
</style>
