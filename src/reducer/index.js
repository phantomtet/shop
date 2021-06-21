import {combineReducers} from 'redux'
import { firebaseReducer } from 'react-redux-firebase'
import { firestoreReducer } from 'redux-firestore'
import { chatlist } from './chatlist'
const combineReducer = combineReducers({
    firebase: firebaseReducer,
    chatlist: chatlist,
    firestore: firestoreReducer,
    
})
export default combineReducer