<template>
  <tr>
    <td v-for="{ name: cellName } of cellsVisible" :key="cellName" class="cell">
      <Loader
        v-if="userInput.tableItemState[cellName] === STATES.SAVING"
        class="loader"
        size="small"
      />

      <template v-else-if="cellName === 'role'">
        <select
          v-model="userInput[cellName]"
          @change="
            save({
              label: cellName,
              userID: userInput.id,
              value: userInput[cellName],
            })
          "
          class="editable"
          :class="'is-' + userInput.tableItemState[cellName]"
        >
          <option
            :value="role.value"
            :key="role.value"
            v-for="role in roles"
            v-html="role.label"
          ></option>
        </select>
      </template>

      <template v-else>
        <input
          type="text"
          v-model="userInput[cellName]"
          @blur="
            save({
              label: cellName,
              userID: userInput.id,
              value: userInput[cellName],
            })
          "
          class="editable"
          :class="'is-' + userInput.tableItemState[cellName]"
        />
      </template>
    </td>
    <td>
      <button @click="save('edit-user', userInput)">Edit</button>
    </td>
  </tr>
</template>

<script>
import api from "@/pure/api";
import Loader from "@/components/Loader.vue";
import tasksManager from "@/pure/tasksManager";

const { ROLES } = require("../../../web/app/constants/permissions.js");

const STATES = {
  DEFAULT: "default",
  SAVING: "saving",
  SAVED: "saved",
  ERROR: "error",
};

export default {
  components: {
    // AdminFileLoader,
    Loader,
    // Tags,
    // InputTextarea,
    // InputMarkdown,
  },

  props: {
    cellsVisible: {
      type: Array,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      STATES,
      roles: Object.values(ROLES).map((value) => ({
        value,
        label: value[0].toUpperCase() + value.slice(1),
      })),
      // visibilities: Object.values(VISIBILITY).map((value) => ({
      //   value,
      //   label: value[0].toUpperCase() + value.slice(1),
      // })),
      userInput: {},
    };
  },

  watch: {
    user: {
      handler(val) {
        this.userInput = Object.assign(
          { tableItemState: {} },
          JSON.parse(JSON.stringify(val))
        );
      },
      immediate: true,
    },
  },

  methods: {
    save({ label, userID, value }) {
      if (this.user[label] === value) {
        return;
      }

      const oldState = this.userInput.tableItemState.label;

      this.$set(this.userInput.tableItemState, label, STATES.SAVING);
      const process = () => {
        api
          .updateUser(userID, { [label]: value })
          .then(() => {
            this.$set(this.userInput.tableItemState, label, STATES.SAVED);
          })
          .catch(() => {
            this.$set(this.userInput.tableItemState, label, STATES.ERROR);
          });
      };

      const cancel = () => {
        this.$set(this.userInput.tableItemState, label, oldState);
      };

      const title = "Update " + label;
      const description =
        String(value).length > 30
          ? String(value).substring(0, 27) + "..."
          : String(value);

      tasksManager.add({
        uid: "user." + userID + ".update." + label,
        title,
        description,
        process,
        cancel,
      });
    },

    async updateContent(user, value) {
      this.$set(user, "input", value);

      // const newItem = await ItemSave.updateItemByInput(user, value);
      // const content = Item.itemToObject(newItem);
      // this.$set(user, "content", content);
    },

    // fileChange(object, label, file = null) {
    //   if (file) {
    //     ItemSave.updateItemByFile(this.itemSave, file).then((itemSave) => {
    //       this.$set(object, label, itemSave.getObject());
    //     });
    //   } else {
    //     ItemSave.removeItemFile(this.itemSave).then((itemSave) => {
    //       this.$set(object, label, itemSave.getObject());
    //     });
    //   }
    // },
  },
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
