<template>
  <table>
    <Loader v-if="loading" />
    <template v-else>
      <tr>
        <td v-for="cell of cells" :key="cell.name">
          <span v-html="cell.label"></span>
          <input type="checkbox" v-model="fullCells[cell.name].enabled" />
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

          <template v-else-if="cell.name === 'title'">
            <input type="text" v-model="item[cell.name]" />
          </template>

          <template v-else-if="cell.name === 'description'">
            <textarea v-model="item[cell.name]"></textarea>
          </template>

          <template v-else-if="cell.name === 'image'">
            <AdminFileLoader
              @change="file => fileChange(item, cell.name, file)"
              :image="item[cell.name]"
              :only-img="false"
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
    </template>
  </table>
</template>

<script>
// import apiGet from '../utils/apiGet'
import Loader from "@/components/Loader.vue";
import ItemsLoader from "@/mixins/ItemsLoader.js";
import Tags from "@/components/Tags.vue";
import { VISIBILITY } from "../../../server/app/constants/permissions";
import AdminFileLoader from "@/admin/AdminFileLoader.vue";

export default {
  mixins: [ItemsLoader],

  components: {
    AdminFileLoader,
    Loader,
    Tags
  },

  data() {
    return {
      fullCells: {
        visibility: { label: "Visibility", enabled: true },
        title: { label: "Title", enabled: true },
        description: { label: "Description", enabled: true },
        tags: { label: "Tags", enabled: true },
        content: { label: "Content", enabled: true },
        file: { label: "File", enabled: true },
        image: { label: "Image", enabled: true },
        score: { label: "Score", enabled: true },
        author: { label: "Author", enabled: true }
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
    }
  },

  methods: {
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
</style>
