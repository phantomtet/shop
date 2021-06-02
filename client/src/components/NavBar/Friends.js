import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { Link } from 'react-router-dom'
import tabaction from '../../actions/tabaction'
export function FriendsButton (props) {
    const isChosen = useSelector(state => state.tab) === 'Friends'
    const dispatch = useDispatch()
    return(
        <div>
           <Link to='/friends'><img onClick={() => dispatch(tabaction('Friends'))} class='canclick' style={{ width: '47px', height: '47px', borderBottom: isChosen ? '3px solid black' : ''}} src='https://image.flaticon.com/icons/png/128/681/681494.png'/></Link>
        </div>
    )
}
export function Friends () {
    return(
        <div>
            this is friends tab
        </div>
    )
}