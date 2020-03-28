<template>
  <div>
    <h2>Groups</h2>
    <ul>
      <li v-for="group of groups" :key="group._id">
        <Group :data="group"></Group>
      </li>
    </ul>
  </div>
</template>

<script>
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

  created () {
    // apiGet.getGroups(this.onBoards)
  },

  methods: {
    onBoards ({ data, meta }) {
      this.groups.splice(0, this.groups.length, ...data)
    }
  }
}
</script>

<style lang="sass" scoped></style>
