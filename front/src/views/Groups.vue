<template>
  <div>
    <!-- <h2>Groups</h2> -->
    <router-view v-if="currentGroup" :group="currentGroup" />
    <ul v-else>
      <li v-for="group of groups" :key="group.id">
        <Group :group="group"></Group>
      </li>
    </ul>
  </div>
</template>

<script>
import api from '../pure/api'
import Group from '@/components/Group.vue'

export default {
  components: {
    Group
  },

  data () {
    return {
      groups: []
    }
  },

  computed: {
    currentGroup () {
      const id = this.$route.params.id ? +('' + this.$route.params.id).split('#')[0] : null
      return id ? this.groups.find(group => group.id === id) : null
    }
  },

  created () {
    api.getGroups(this.onBoards)
      .then(groups => {
        this.groups = groups
      })
  },

  methods: {
    onBoards ({ data, meta }) {
      this.groups.splice(0, this.groups.length, ...data)
    }
  }
}
</script>

<style lang="sass" scoped></style>
