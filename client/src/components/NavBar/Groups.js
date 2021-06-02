import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import tabaction from '../../actions/tabaction'
export default function Groups (props) {
    const isChosen = useSelector(state => state.tab) === 'Groups'
    const dispatch = useDispatch()
    return(
        <div>
            <img onClick={() => dispatch(tabaction('Groups'))} class='canclick' style={{ width: '47px', height: '47px', borderBottom: isChosen ? '3px solid black' : ''}} src='https://www.pikpng.com/pngl/b/83-832736_download-group-icon-png-transparent-clipart.png'/>
        </div>
    )
}