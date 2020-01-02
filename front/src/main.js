import Vue from 'vue'
import store from '@/store/index.js'
import router from '@/router/index.js'
import App from '@/App.vue'
import '@/registerServiceWorker'

Vue.config.productionTip = false

fetch('/api/inspire/items/posts')
  .then(console.log)

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
