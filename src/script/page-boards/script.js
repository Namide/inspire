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
        api.getGroups(this.onBoards)
    },

    methods:
    {
        onBoards({data, meta})
        {
            this.boards.splice(0, this.boards.length, ...data)
        }
    }
}