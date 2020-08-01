<template>
  <div>
    <h2>Install {{ $route.params.type }}</h2>

    <div v-if="isDatabase" class="connect">
      <div class="form">
        <label for="userName">userName</label>
        <input
          type="text"
          name="userName"
          v-model="database.userName"
          placeholder="userName"
        />

        <label for="userPassword">userPassword</label>
        <input
          type="password"
          v-model="database.userPassword"
          placeholder="userPassword"
        />

        <label for="databaseAuth">databaseAuth</label>
        <input type="text" v-model="database.auth" placeholder="databaseAuth" />

        <label for="databaseName">databaseName</label>
        <input type="text" v-model="database.name" placeholder="databaseName" />

        <label for="databaseHost">databaseHost</label>
        <input type="text" v-model="database.host" placeholder="databaseHost" />

        <label for="databasePort">databasePort</label>
        <input
          type="number"
          v-model="database.port"
          placeholder="databasePort"
        />

        <div v-if="error" class="error">
          <span v-html="error"></span>
        </div>
        <div v-if="success" class="success">
          <span v-html="success"></span>
        </div>

        <button @click="testDatabase">Test</button>
        <button @click="connectDatabase">Connect</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/pure/apiSave";

export default {
  components: {},

  props: {},

  data() {
    return {
      error: "",
      success: "",
      database: {
        userName: "damien",
        userPassword: "password",
        auth: "DEFAULT",
        name: "inspire",
        host: "inspire-db",
        port: "27017",
      },
    };
  },

  computed: {
    isDatabase() {
      return this.$route.params.type === "database";
    },
    isAdmin() {
      return this.$route.params.type === "admin";
    },
  },

  methods: {
    testDatabase() {
      this.error = "";
      this.success = "";
      api
        .databaseTest(this.database)
        .then((success) => (this.success = "Database ID accepted!"))
        .catch((error) => (this.error = error.message));
    },
    connectDatabase() {
      this.error = "";
      this.success = "";
      api
        .login(this.mail, this.pass)
        .then((user) => this.$emit("close"))
        .catch((error) => (this.error = error.message));
    },
  },
};
</script>

<style lang="sass" scoped>
.error
  color: red
  margin-top: 1em

.form
  width: 90%
  max-width: 950px
  padding: 1em
  text-align: center

  label
    width: 50%
    display: inline-block
    text-align: right
    padding: 0.3em

  input
    width: 50%
    padding: 0.3em

  button
    margin-top: 1em
</style>
