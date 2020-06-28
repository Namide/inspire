<template>
  <div class="items-table">
    <Loader v-if="loading" />
    <template v-else>
      <div v-if="hideCells.length">
        <span>Disabled cells: </span>
        <span v-for="cell of hideCells" :key="cell.name">
          <label :for="cell.label" v-html="cell.label"></label>
          <input
            :id="cell.label"
            type="checkbox"
            v-model="cells[cell.name].enabled"
          />
        </span>
      </div>
      <table class="main-table">
        <tr>
          <td v-for="cell of cellsVisible" :key="cell.name">
            <label :for="cell.label" v-html="cell.label"></label>
            <input
              :id="cell.label"
              type="checkbox"
              v-model="cells[cell.name].enabled"
            />
          </td>
        </tr>
        <TableItem
          :item="item"
          :cellsVisible="cellsVisible"
          v-for="item of items"
          :key="item.id"
        />
      </table>
    </template>
  </div>
</template>

<script>
import Loader from "@/components/Loader.vue";
import ItemsLoader from "@/mixins/ItemsLoader.js";
import TableItem from "@/admin/TableItem.vue";

export default {
  mixins: [ItemsLoader],

  components: {
    Loader,
    TableItem
  },

  data() {
    return {
      cells: {
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
      cellClass: {}
    };
  },

  computed: {
    cellsVisible() {
      return Object.keys(this.cells)
        .map(name => Object.assign({ name }, this.cells[name]))
        .filter(({ enabled }) => enabled);
    },
    hideCells() {
      return Object.keys(this.cells)
        .map(name => Object.assign({ name }, this.cells[name]))
        .filter(({ enabled }) => !enabled);
    }
  },

  methods: {}
};
</script>

<style lang="sass" scoped>
@import "../style/settings.sass"

.items-table
  width: 100%
  overflow: auto

.main-table
  width: 100%

.items
</style>
