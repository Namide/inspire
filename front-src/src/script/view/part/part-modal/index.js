import { h, app } from 'hyperapp'
import './style.sass'

export default ({ onClose }, children) => (state, actions) =>
{
    return (
        <div class="modal">
            <div class="modal_bg" onclick={ onClose }></div>
            <div class="modal_content">
                { children }
            </div>
        </div>
    )
}