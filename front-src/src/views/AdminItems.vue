<template>
  <div>
    <Tags @change="filter" />

    <div>
      <button @click="isModalOpen = true">+ Add new item</button>
    </div>

    <!-- <Loader v-if="loading" /> -->

    <TableItems :filter="filter" @editItem="edit"></TableItems>
    <!-- <PartAdminItem
      v-else
      v-for="item of items"
      :key="item.id"
      :item="item"
    ></PartAdminItem> -->

    <!-- Modal -->

    <!-- Edit item (create or edit) -->
    <Modal :is-open="isModalOpen" @close="isModalOpen = false">
      <AdminItemForm
        :item="editItem"
        :create="!editItem"
        @cancel="isModalOpen = false"
      ></AdminItemForm>
    </Modal>
  </div>
</template>

<script>
import Tags from "@/components/Tags.vue";
import TableItems from "@/admin/TableItems.vue";
import AdminItemForm from "@/admin/AdminItemForm.vue";
import Modal from "@/components/Modal.vue";

export default {
  components: {
    TableItems,
    AdminItemForm,
    Modal,
    Tags,
  },

  data() {
    return {
      isModalOpen: false,
      filter: [],
      editItem: null,
    };
  },

  methods: {
    edit(item) {
      this.editItem = item;
      this.isModalOpen = true;
    },
  },
};
</script>

<style lang="sass" scoped></style>
