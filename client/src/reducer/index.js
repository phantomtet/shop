import {combineReducers} from 'redux'
import tab from './tab'
import clientinfo from './clientinfo'
const combineReducer = combineReducers({
    clientinfo: clientinfo,
    tab: tab,

})
export default combineReducer