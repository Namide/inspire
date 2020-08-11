<template>
  <div v-if="adminPage || $state.isLogged" class="connect">
    <!-- Modal connect -->
    <Modal :is-open="isModalConnectOpen" @close="isModalConnectOpen = false">
      <Connect @close="isModalConnectOpen = false" />
    </Modal>

    <span v-if="$state.user.name">{{ $state.user.name }} </span>

    <button v-if="!$state.isLogged" @click="isModalConnectOpen = true">
      Signin
    </button>
    <button v-else @click="logout">Signout</button>

    <img
      v-if="$state.user.userImage"
      :src="$state.user.userImage.src"
      :width="$state.user.userImage.width"
      :height="$state.user.userImage.height"
      alt="avatar"
      class="avatar"
    />
  </div>
</template>

<script>
import api from "@/pure/api";
import Modal from "@/components/Modal.vue";
import Connect from "@/components/Connect.vue";

export default {
  components: {
    Modal,
    Connect,
  },

  props: {
    adminPage: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isModalConnectOpen: false,
    };
  },

  methods: {
    logout() {
      api.logout();
    },
  },
};
</script>

<style lang="sass" scoped>
@import "../style/settings.sass"

.connect
  display: flex
  align-items: center

  &>*
    margin-left: $margin-sm

.avatar
  width: 64px
  height: 64px
</style>
