import React, { useEffect, useState } from 'react'
import AccountOption from './AccountOption'
import Notification from './Notification'
import Messages from './Messages'
import Menu from './Menu'
import {HomeButton} from '../Home/Home'
import {FriendsButton} from './Friends'
import Watch from './Watch'
import Market from './Market'
import Groups from './Groups'
import {BsSearch} from 'react-icons/bs'
import {FaFacebook} from 'react-icons/fa'
export default function NavBar (props) {
    
    return(
        <div id='NavBar' className='color3' style={{justifyContent: 'center'}}>
            <div style={{display: 'flex', position: 'absolute', left: '0', margin: '5px 0 5px 15px'}} >
                <FaFacebook size='40' className='canclick'/>
                <Search/> 
            </div>
            <div id='NavMid'>
                    <HomeButton/>
                    <FriendsButton/>
                    <Watch/>
                    <Market/>
                    <Groups/>
            </div>
            <div style={{display: 'flex', position: 'absolute', right: 0}}>
                <Menu/>
                <Messages/>
                <Notification/>
                <AccountOption/>
            </div>
        </div>
    )
}

function Search () {
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
        <div id='searchbar' style={{display: 'flex',}}>
            { isOpen ? 
            <div>
                <input autoFocus={isOpen} className='searchfield' placeholder='Search on facebook'/>
            </div>
            : 
            <BsSearch onMouseUp={open} size='40' className='canclick'/>
            }
        </div>
    )
}
