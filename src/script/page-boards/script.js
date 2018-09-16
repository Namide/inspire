import apiGet from '../utils/apiGet'
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
        apiGet.getGroups(this.onBoards)
    },

    methods:
    {
        onBoards({data, meta})
        {
            this.boards.splice(0, this.boards.length, ...data)
        }
    }
}