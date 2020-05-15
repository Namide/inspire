<template>
  <div v-if="adminPage || $store.getters.isLogged" class="connect">
    <!-- Modal connect -->
    <Modal :is-open="isModalConnectOpen" @close="isModalConnectOpen = false">
      <Connect />
    </Modal>

    <span v-if="$store.getters.userNick">{{ $store.getters.userNick }} </span>

    <button v-if="!$store.getters.isLogged" @click="isModalConnectOpen = true">
      Signin
    </button>
    <button v-else @click="logout">Signout</button>

    <img
      v-if="$store.getters.userImage"
      :src="$store.getters.userImage.src"
      :width="$store.getters.userImage.width"
      :height="$store.getters.userImage.height"
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
    Connect
  },

  props: {
    adminPage: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isModalConnectOpen: false
    };
  },

  methods: {
    logout() {
      api.logout();
    }
  }
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
