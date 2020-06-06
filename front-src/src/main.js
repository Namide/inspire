import Vue from "vue";
// import store from '@/store/index.js'
import router from "@/router/index.js";
import App from "@/App.vue";
import api from "@/pure/api.js";
import "@/registerServiceWorker";
import "@/style/basic.sass";

Vue.config.productionTip = false;

// fetch('/api/inspire/items/items')
//   .then(console.log)
Vue.prototype.$state = api.$state;

// injection d'une fonction pour l'option personnalisée `myOption`
Vue.mixin({
  methods: {
    addAuth: api.addAuth
  }
});

new Vue({
  data: {
    // Dynamise custom store
    $state: api.$state
  },
  router,
  render: h => h(App)
}).$mount("#app");