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
Vue.prototype.$state = api.$state;
Vue.prototype.$tasks = tasksManager.$tasks;

// injection d'une fonction pour l'option personnalisée `myOption`
Vue.mixin({
  methods: {
    addAuth: api.addAuth,
  },
});

new Vue({
  data: {
    // Dynamise global data
    $state: api.$state,
    $tasks: tasksManager.$tasks,
  },
  router,
  render: (h) => h(App),
}).$mount("#app");
