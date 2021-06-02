import React, { useEffect, useState } from 'react'
import AccountOption from './AccountOption'
import Notification from './Notification'
import Messages from './Messages'
import Menu from './Menu'
import {HomeButton} from './Home'
import {FriendsButton} from './Friends'
import Watch from './Watch'
import Market from './Market'
import Groups from './Groups'
import { useDispatch, useSelector } from 'react-redux'
import { addinfo } from '../../actions/clientinfoAction'
export default function NavBar (props) {
    
    return(
        <div id='NavBar'>
            <div style={{display: 'flex', position: 'absolute', left: '0', margin: '5px 0 5px 10px'}}>
                <img class='circle1 canclick' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLeVeunciOSCosTRKOAeiKQXMZfQ8h5H5REXHpY3NTCCJ5NpUIZGrTvNyeKEtRZP-iflo&usqp=CAU'/>
                <Search/> 
                
            </div>
            <div style={{display: 'flex'}}>
                
                    <HomeButton/>
                    <FriendsButton/>
                    <Watch/>
                    <Market/>
                    <Groups/>
                
            </div>
            <div style={{display: 'flex', position: 'absolute', right: '0', margin: '5px 10px 5px 0'}}>
                <Menu/>
                <Messages/>
                <Notification/>
                <AccountOption/>
            </div>
        </div>
    )
}

function Search (props) {
    const [isOpen, setOpen] = useState(false)
    const open = () => {
        setOpen(true)
        const func = (target) => {
            if (!document.getElementById('searchbar').contains(target.target)) {
                setOpen(false)
                document.removeEventListener('mousedown', func)
            }
        }
        document.addEventListener('mousedown', func)
    }
    return(
        <div id='searchbar'  style={{display: 'flex',}}>
            { isOpen ? 
            <div>
                <input autoFocus={isOpen} class='searchfield' placeholder='Search on facebook'/>
            </div>
            : 
            <img onMouseUp={open} class='circle1 canclick' src='https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/search-512.png'/>}
        </div>
    )
}
