import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import tabaction from '../../actions/tabaction'
export default function Market (props) {
    const isChosen = useSelector(state => state.tab) === 'Market'
    const dispatch = useDispatch()
    return(
        <div>
            <img onClick={() => dispatch(tabaction('Market'))} class='canclick' style={{ width: '47px', height: '47px', borderBottom: isChosen ? '3px solid black' : ''}} src='https://static.thenounproject.com/png/13611-200.png'/>
        </div>
    )
}