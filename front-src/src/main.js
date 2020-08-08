import Vue from "vue";
// import store from '@/store/index.js'
import router from "@/router/index.js";
import App from "@/App.vue";
import api from "@/pure/api.js";
import tasksManager from "@/pure/tasksManager.js";
import "@/registerServiceWorker";
import "@/style/basic.sass";

Vue.config.productionTip = false;

// fetch('/api/inspire/items/items')
//   .then(console.log)
Vue.prototype.$tasks = tasksManager.$tasks;

// injection d'une fonction pour l'option personnalisée `myOption`
Vue.mixin({
  computed: {
    $state() {
      return this.$root.state;
    },
  },
  methods: {
    addAuth: api.addAuth,
    redirect(route) {
      if (
        !this.$route ||
        route.name !== this.$route.name ||
        JSON.stringify(route.params) !== JSON.stringify(this.$route.params)
      ) {
        this.$router.push(route);
      }
    },
  },
});

new Vue({
  data: {
    // Dynamise global data
    $tasks: tasksManager.$tasks,
    state: Object.assign({}, api.state),
  },
  router,
  created() {
    api.onStateChange.add(this.updateState);
  },
  methods: {
    updateState(state) {
      console.log(state);
      this.state = state;
    },
  },
  render: (h) => h(App),
}).$mount("#app");
