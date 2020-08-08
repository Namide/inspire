<template>
  <div class="connect">
    <div>
      <input type="email" v-model="mail" placeholder="email" />
      <input type="password" v-model="pass" placeholder="password" />
      <button @click="login">Signin</button>
    </div>
    <div>
      <span v-if="error" v-html="error"></span>
    </div>
  </div>
</template>

<script>
import api from "@/pure/api";

export default {
  components: {},

  data() {
    return {
      mail: "",
      pass: "",
      error: "",
    };
  },

  methods: {
    login() {
      this.error = "";
      api
        .login(this.mail, this.pass)
        .then((user) => this.$emit("close"))
        .catch((error) => (this.error = error.message));
    },
  },
};
</script>

<style lang="sass" scoped>
.connect
  position: absolute
  top: 50px
  right: 50px
  flex-direction: column
</style>
