<template>
  <div class="users-table">
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
        <TableUser
          :user="user"
          :cellsVisible="cellsVisible"
          v-for="user of users"
          :key="user.id"
        />
      </table>
    </template>
  </div>
</template>

<script>
import api from "@/pure/api";
import Loader from "@/components/Loader.vue";
import TableUser from "@/admin/TableUser.vue";

export default {
  components: {
    Loader,
    TableUser,
  },
  watch: {
    filter: {
      immediate: true,
      handler(filter) {
        this.loading = true;
        api
          .getUsers(filter)
          .then((users) => {
            this.users = users;
          })
          .catch(console.error)
          .finally(() => {
            this.loading = false;
          });
      },
    },
  },

  data() {
    return {
      users: [],
      loading: false,
      cells: {
        name: { label: "Name", enabled: true },
        email: { label: "E-Mail", enabled: true },
        role: { label: "Role", enabled: true },
      },
      cellClass: {},
    };
  },

  computed: {
    cellsVisible() {
      return Object.keys(this.cells)
        .map((name) => Object.assign({ name }, this.cells[name]))
        .filter(({ enabled }) => enabled);
    },
    hideCells() {
      return Object.keys(this.cells)
        .map((name) => Object.assign({ name }, this.cells[name]))
        .filter(({ enabled }) => !enabled);
    },
  },

  methods: {},
};
</script>

<style lang="sass" scoped>
@import "../style/settings.sass"

.users-table
  width: 100%
  overflow: auto

.main-table
  width: 100%

.users
</style>
