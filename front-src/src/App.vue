<template>
  <main id="app">
    <header class="header">
      <router-link class="title black" :to="{ name: 'home' }">
        <h1>Inspire</h1>
      </router-link>
      <User :adminPage="authRequired" />
    </header>

    <Menu />

    <router-view v-if="!authRequired || $state.isLogged" />

    <ModalItem />
    <Tasks />

    <!-- Modal connect (auto display if auth required) -->
    <Modal :is-open="authRequired && !$state.isLogged" @close="() => 1">
      <Connect @close="() => 1" />
    </Modal>
  </main>
</template>

<script>
import api from "@/pure/api";
import ModalItem from "@/components/ModalItem.vue";
import Modal from "@/components/Modal.vue";
import Connect from "@/components/Connect.vue";
import Menu from "@/components/Menu.vue";

const User = () => import(/* webpackChunkName: "admin" */ "@/components/User");
const Tasks = () => import(/* webpackChunkName: "admin" */ "@/admin/Tasks");

export default {
  name: "App",

  components: {
    User,
    ModalItem,
    Modal,
    Connect,
    Tasks,
    Menu,
  },

  computed: {
    authRequired() {
      return this.$route.meta.auth;
    },
  },

  watch: {
    "$state.needDatabase": {
      immediate: true,
      handler(needDatabase) {
        if (needDatabase) {
          this.redirect({
            name: "adminInstall",
            params: { type: "database" },
          });
        }
      },
    },
    "$state.needAdmin": {
      immediate: true,
      handler(needAdmin) {
        if (needAdmin) {
          this.redirect({
            name: "adminInstall",
            params: { type: "user" },
          });
        }
      },
    },
  },

  created() {
    api.onError.add(this.displayError);
    api.onRedirect.add(this.redirect);
    api.init();
  },

  destroyed() {
    // api.onLogin.remove(this.setLogged);
    api.onError.remove(this.displayError);
  },

  methods: {
    displayError(message) {
      // alert(message);
      console.error(message);
    },
  },
};
</script>

<style lang="sass" scoped>
@import "./style/settings.sass"

.header
  display: flex
  align-items: center
  padding: 0 $margin-sm
  background: #000

.title
  text-transform: uppercase
  margin-right: auto
  text-decoration: none
</style>
