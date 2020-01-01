<template>
  <div>
    <h2>Boards</h2>
    <ul>
      <li v-for="board of boards" :key="board._id">
        <Board :data="board"></Board>
      </li>
    </ul>
  </div>
</template>

<script>
import Board from '@/components/Board.vue'

export default
{
  components: {
    Board
  },

  data () {
    return {
      boards: []
    }
  },

  created () {
    // apiGet.getGroups(this.onBoards)
  },

  methods: {
    onBoards ({ data, meta }) {
      this.boards.splice(0, this.boards.length, ...data)
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
