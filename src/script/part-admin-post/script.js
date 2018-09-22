import apiSet from '../utils/apiSet'
import PartAdminFileLoader from '../part-admin-file-loader'
import PartContent from '../part-content'
import PartAdminPostModal from '../part-admin-post-modal'

export default
{
    components:
    {
        PartAdminFileLoader,
        PartContent,
        PartAdminPostModal
    },

    props:
    {
        post: { type: Object },
        insert: { type: Boolean, default: false }
    },

    data()
    {
        return {
            isModalOpen: false
        }
    },

    methods:
    {
    }
}
