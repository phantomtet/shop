import axios from "axios"

const initialState = ''
const clientinfo = (state = initialState, action) => {
    switch (action.type) {
        case 'addinfo':
            return action.state
        case 'removeinfo':
            return ''
        default:
            return state
    }
}
export default clientinfo