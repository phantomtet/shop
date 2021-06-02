import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import tabaction from '../../actions/tabaction'
export default function Watch (props) {
    const isChosen = useSelector(state => state.tab) === 'Watch'
    const dispatch = useDispatch()
    return(
        <div>
            <img onClick={() => dispatch(tabaction('Watch'))} class='canclick' style={{ width: '47px', height: '47px', borderBottom: isChosen ? '3px solid black' : ''}} src='https://cdn1.iconfinder.com/data/icons/user-outline-3/48/FB_Icon-02-512.png'/>
        </div>
    )
}