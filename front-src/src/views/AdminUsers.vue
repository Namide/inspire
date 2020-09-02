<template>
  <div>
    <Tags @change="filter" />

    <div>
      <button @click="isModalOpen = true">+ Add new item</button>
    </div>

    <TableUsers :filter="filter" @editItem="edit"></TableUsers>

    <!-- Modal -->

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
import TableUsers from "@/admin/TableUsers.vue";
import AdminItemForm from "@/admin/AdminItemForm.vue";
import Modal from "@/components/Modal.vue";

export default {
  components: {
    TableUsers,
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
