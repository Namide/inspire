import api from '../utils/api'
import PartBoard from '../part-board'

export default
{
    components:
    {
        PartBoard
    },

    data()
    {
        return {
            boards: []
        }
    },

    created()
    {
        api.getBoards(this.onBoards)
    },

    methods:
    {
        onBoards(boards)
        {
            this.boards = JSON.parse(JSON.stringify(boards.entries))
        }
    }
}