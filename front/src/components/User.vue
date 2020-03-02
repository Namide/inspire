<template>
  <div v-if="adminPage || isLogged" class="connect">

    <button v-if="!isLogged" @click="isModalConnectOpen = true">Signin</button>
    <button v-else @click="logout">Signout</button>

    <!-- Modal connect -->
    <Modal :is-open="isModalConnectOpen" @close="isModalConnectOpen = false">
      <Connect @logged="update"></Connect>
    </Modal>

    <span v-if="firstName">{{ firstName }}</span>
    <span v-if="lastName">{{ lastName }}</span>

    <img v-if="avatar" :src="avatar.src" :width="avatar.width" :height="avatar.height" alt="avatar" class="avatar"/>

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

  props: {
    adminPage: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      isLogged: false,
      isModalConnectOpen: false,
      avatar: null,
      firstName: '',
      lastName: ''
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
          this.update()
        })
    },

    update () {
      api.isLoggedIn().then(isLogged => {
        this.isLogged = isLogged
        if (isLogged) {
          api.getMe()
            .then(data => {
              this.isLogged = true
              this.avatar = data.avatar
              this.firstName = data.firstName
              this.lastName = data.lastName
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

.avatar
  width: 64px
  height: 64px
</style>
