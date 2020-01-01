import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'

Vue.config.productionTip = false

fetch('/api/inspire/items/posts')
  .then(console.log)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
