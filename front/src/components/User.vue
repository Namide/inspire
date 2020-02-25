<template>
  <div class="connect">

    <button v-if="!isLogged" @click="isModalConnectOpen = true">Signin</button>
    <button v-else @click="logout">Signout</button>

    <!-- Modal connect -->
    <Modal :is-open="isModalConnectOpen" @close="isModalConnectOpen = false">
      <Connect @logged="update"></Connect>
    </Modal>

  </div>
</template>

<script>
import api from '@/pure/api'
import Modal from '@/components/Modal.vue'
import Connect from '@/components/Connect.vue'

export default {
  components: {
    Modal,
    Connect
  },

  data () {
    return {
      isLogged: false,
      isModalConnectOpen: false
    }
  },

  created () {
    this.update()

    this.isLogged = api.isLogged
    api.onLogin.add(this.updateLogged)
  },

  destroyed () {
    api.onLogin.remove(this.updateLogged)
  },

  methods: {
    updateLogged (isLogged) {
      this.isLogged = isLogged
    },

    login () {

    },

    logout () {
      api.logout()
        .then(data => {
          console.log(data)
          this.update()
        })
    },

    update () {
      console.log(api.directus)
      console.log('api:', api)
      api.isLoggedIn().then(isLogged => {
        console.log('isLogged:', isLogged)
        this.isLogged = isLogged
        if (isLogged) {
          api.getMe()
            .then(data => {
              this.isLogged = true
              console.log(data)
            })
        }
      })
    }
  }
}
</script>

<style lang="sass" scoped>
.connect
  position: absolute
  top: 50px
  right: 50px
</style>
