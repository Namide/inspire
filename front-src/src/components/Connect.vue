<template>
  <div class="connect">
    <input type="text" v-model="mail" placeholder="login" />
    <input type="password" v-model="pass" placeholder="password" />
    <button @click="login">Signin</button>
  </div>
</template>

<script>
import api from "@/pure/api";

export default {
  components: {},

  data() {
    return {
      mail: "",
      pass: ""
    };
  },

  methods: {
    login() {
      api.login(this.mail, this.pass).then(() => {
        this.$emit("logged");
      });
    }
  }
};
</script>

<style lang="sass" scoped>
.connect
  position: absolute
  top: 50px
  right: 50px
</style>
