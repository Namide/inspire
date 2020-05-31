<template>
  <Modal :is-open="!!$route.params.itemID" @close="close()">
    <Loader v-if="!item" />
    <template v-else>
      <ItemDetails v-if="!edit" :item="item" />
      <AdminItemForm
        v-else
        :item="item"
        :create="false"
        @cancel="close()"
      ></AdminItemForm>
      <button v-if="$state.isLogged && !edit" @click="edit = true">
        Edit
      </button>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/Modal.vue";
import ItemDetails from "@/components/ItemDetails.vue";
import Loader from "@/components/Loader.vue";
import api from "@/pure/api";

export default {
  components: {
    Modal,
    Loader,
    ItemDetails,
    AdminItemForm: () =>
      import(/* webpackChunkName: "admin" */ "@/admin/AdminItemForm")
  },

  data() {
    return {
      hash: "",
      edit: false,
      item: null
    };
  },

  watch: {
    "$route.params": {
      immediate: true,
      handler({ itemID }) {
        this.edit = false;

        if (itemID) {
          this.loading = true;
          api
            .getItem(itemID)
            .then(item => {
              this.item = item;
            })
            .catch(console.error)
            .finally(() => {
              this.loading = false;
            });
        } else {
          this.item = null;
        }
      }
    }
  },

  methods: {
    close() {
      this.$router.push({ name: this.$route.name });
    },

    onHash() {
      const hash = window.location.hash;
      this.hash = hash.replace(/^#/, "");
    }
  }
};
</script>

<style lang="sass" scoped>
@import "../style/settings.sass"
</style>
