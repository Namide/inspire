<template>
  <div>
    <h2>Install {{ $route.params.type }}</h2>

    <div v-if="isDatabase">
      <div class="form">
        <label>userName</label>
        <input
          type="text"
          name="userName"
          v-model="database.userName"
          placeholder="userName"
        />

        <label>userPassword</label>
        <input
          type="password"
          v-model="database.userPassword"
          placeholder="userPassword"
        />

        <label>databaseAuth</label>
        <input type="text" v-model="database.auth" placeholder="databaseAuth" />

        <label>databaseName</label>
        <input type="text" v-model="database.name" placeholder="databaseName" />

        <label>databaseHost</label>
        <input type="text" v-model="database.host" placeholder="databaseHost" />

        <label>databasePort</label>
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
        <button @click="connectDatabase">Install</button>
      </div>
    </div>

    <div v-else-if="isAdmin">
      <div class="form">
        <label>name</label>
        <input
          type="text"
          name="name"
          v-model="admin.name"
          placeholder="name"
        />

        <label>email</label>
        <input
          type="email"
          email="email"
          v-model="admin.email"
          placeholder="email"
        />

        <label>password</label>
        <input
          type="password"
          v-model="admin.password"
          placeholder="password"
        />

        <div v-if="error" class="error">
          <span v-html="error"></span>
        </div>
        <div v-if="success" class="success">
          <span v-html="success"></span>
        </div>

        <button @click="addAdmin">Register</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/pure/api";
const { ROLES } = require("../../../web/app/constants/permissions.js");

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
      admin: {
        name: "",
        email: "",
        password: "",
      },
    };
  },

  computed: {
    isDatabase() {
      return this.$route.params.type === "database";
    },
    isAdmin() {
      return this.$route.params.type === "user";
    },
  },

  watch: {
    $state: {
      immediate: true,
      deep: true,
      handler(state) {
        if (!state.needDatabase && !state.needAdmin) {
          this.$router.push({
            name: "admin",
          });
        }
      },
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
        .installDatabase(this.database)
        .catch((error) => (this.error = error.message));
    },
    addAdmin() {
      this.error = "";
      this.success = "";
      api
        .installUser(Object.assign({ role: ROLES.ADMIN }, this.admin))
        .catch((error) => (this.error = error.message));
    },
  },
};
</script>

<style lang="sass" scoped>
.error
  color: red
  margin-top: 1em

.success
  color: green
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
    margin: 1em
</style>
